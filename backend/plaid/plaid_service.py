from __future__ import annotations
from typing import Any
import plaid, json
from plaid.api import plaid_api
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.transactions_sync_request import TransactionsSyncRequest


class PlaidService:
    def __init__(self, app_config: Any) -> None:
        self.client_id = app_config.get("PLAID_CLIENT_ID")
        self.secret = app_config.get("PLAID_SECRET")
        self.env = (app_config.get("PLAID_ENV") or "sandbox").lower()
        self.products = self._parse_csv_config(
            app_config.get("PLAID_PRODUCTS", "transactions")
        )
        self.country_codes = self._parse_csv_config(
            app_config.get("PLAID_COUNTRY_CODES", "US")
        )
        self.redirect_uri = app_config.get("PLAID_REDIRECT_URI")

        if not self.client_id:
            raise ValueError("PLAID_CLIENT_ID is missing")
        if not self.secret:
            raise ValueError("PLAID_SECRET is missing")

        self.client = self._build_client()

    def _build_client(self) -> plaid_api.PlaidApi:
        if self.env == "sandbox":
            host = plaid.Environment.Sandbox
        elif self.env == "production":
            host = plaid.Environment.Production
        else:
            raise ValueError(f"Unsupported PLAID_ENV: {self.env}")

        configuration = plaid.Configuration(
            host=host,
            api_key={
                "clientId": self.client_id,
                "secret": self.secret,
                "plaidVersion": "2020-09-14",
            },
        )

        api_client = plaid.ApiClient(configuration)
        return plaid_api.PlaidApi(api_client)

    @staticmethod
    def _parse_csv_config(value: str | list[str] | None) -> list[str]:
        if value is None:
            return []
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip()]
        return [part.strip() for part in value.split(",") if part.strip()]

    @staticmethod
    def _format_plaid_exception(exc: plaid.ApiException) -> PlaidServiceError:
        body: dict[str, Any] = {}
        try:
            body = exc.body and __import__("json").loads(exc.body) or {}
        except Exception:
            body = {}

        return PlaidServiceError(
            body.get("error_message", "Plaid API request failed"),
            status_code=getattr(exc, "status", None),
            error_code=body.get("error_code"),
            error_type=body.get("error_type"),
            raw=body,
        )

    def create_link_token(self, *, user_id: str, client_name: str = "Budget App") -> dict[str, Any]:
        """
        Create a short-lived link_token for Plaid Link.
        user_id should be your internal app user id, not email/PII.
        """
        try:
            request = LinkTokenCreateRequest(
                products=[Products(product) for product in self.products],
                client_name=client_name,
                country_codes=[CountryCode(code) for code in self.country_codes],
                language="en",
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(user_id)
                ),
            )

            if self.redirect_uri:
                request["redirect_uri"] = self.redirect_uri

            response = self.client.link_token_create(request)
            return response.to_dict()

        except plaid.ApiException as exc:
            raise self._format_plaid_exception(exc) from exc

    def exchange_public_token(self, *, public_token: str) -> dict[str, Any]:
        """
        Exchange a frontend public_token for a backend access_token + item_id.
        Store the returned access_token server-side in your DB.
        """
        try:
            request = ItemPublicTokenExchangeRequest(public_token=public_token)
            response = self.client.item_public_token_exchange(request).to_dict()

            return {
                "access_token": response["access_token"],
                "item_id": response["item_id"],
                # request_id can be useful for debugging with Plaid support
                "request_id": response.get("request_id"),
            }

        except plaid.ApiException as exc:
            raise self._format_plaid_exception(exc) from exc

    def sync_transactions(self, *, access_token: str, cursor: str | None = None,) -> dict[str, Any]:
        """
        Fetch all available transaction pages using /transactions/sync.
        Returns raw added/modified/removed plus the latest cursor.
        """
        try:
            next_cursor = cursor or ""
            original_cursor = next_cursor

            added: list[dict[str, Any]] = []
            modified: list[dict[str, Any]] = []
            removed: list[dict[str, Any]] = []
            has_more = True

            while has_more:
                request = TransactionsSyncRequest(
                    access_token=access_token,
                    cursor=next_cursor,
                )
                response = self.client.transactions_sync(request).to_dict()

                # Plaid returns incremental changes from this cursor forward
                added.extend(response.get("added", []))
                modified.extend(response.get("modified", []))
                removed.extend(response.get("removed", []))
                next_cursor = response.get("next_cursor", next_cursor)
                has_more = response.get("has_more", False)

            return {
                "added": added,
                "modified": modified,
                "removed": removed,
                "next_cursor": next_cursor,
                "original_cursor": original_cursor,
            }

        except plaid.ApiException as exc:
            raise self._format_plaid_exception(exc) from exc

    def get_normalized_transactions(self, *, access_token: str, cursor: str | None = None) -> dict[str, Any]:
        """
        Convenience wrapper for your app layer.
        Returns normalized transactions your frontend can consume easily.
        """
        sync_result = self.sync_transactions(
            access_token=access_token,
            cursor=cursor,
        )

        normalized_added = [
            self._normalize_transaction(tx) for tx in sync_result["added"]
        ]
        normalized_modified = [
            self._normalize_transaction(tx) for tx in sync_result["modified"]
        ]

        return {
            "added": normalized_added,
            "modified": normalized_modified,
            "removed": sync_result["removed"],
            "next_cursor": sync_result["next_cursor"],
        }

    def _normalize_transaction(self, tx: dict[str, Any]) -> dict[str, Any]:
        location = tx.get("location") or {}
        payment_meta = tx.get("payment_meta") or {}
        category_info = tx.get("personal_finance_category") or {}

        return {
            "transaction_id": tx.get("transaction_id"),
            "account_id": tx.get("account_id"),
            "name": tx.get("name"),
            "merchant_name": tx.get("merchant_name"),
            "amount": tx.get("amount"),
            "iso_currency_code": tx.get("iso_currency_code"),
            "date": tx.get("date"),
            "pending": tx.get("pending"),
            "category_primary": category_info.get("primary"),
            "category_detailed": category_info.get("detailed"),
            "authorized_date": tx.get("authorized_date"),
            "payment_channel": tx.get("payment_channel"),
            "payment_method": payment_meta.get("payment_method"),
            "location": {
                "address": location.get("address"),
                "city": location.get("city"),
                "region": location.get("region"),
                "postal_code": location.get("postal_code"),
                "country": location.get("country"),
                "lat": location.get("lat"),
                "lon": location.get("lon"),
                "store_number": location.get("store_number"),
            },
            "has_location": any(
                [
                    location.get("address"),
                    location.get("city"),
                    location.get("region"),
                    location.get("postal_code"),
                    location.get("country"),
                    location.get("lat"),
                    location.get("lon"),
                    location.get("store_number"),
                ]
            ),
            # keep raw in prototype if you want easier debugging
            "raw": tx,
        }



class PlaidServiceError(Exception):
    """Application-level wrapper for Plaid API errors."""

    def __init__(
        self,
        message: str,
        *,
        status_code: int | None = None,
        error_code: str | None = None,
        error_type: str | None = None,
        raw: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.error_type = error_type
        self.raw = raw or {}

    def to_dict(self) -> dict[str, Any]:
        return {
            "error": {
                "message": self.message,
                "status_code": self.status_code,
                "error_code": self.error_code,
                "error_type": self.error_type,
                "raw": self.raw,
            }
        }
    

def build_plaid_service(app_config: Any) -> PlaidService:
    return PlaidService(app_config)