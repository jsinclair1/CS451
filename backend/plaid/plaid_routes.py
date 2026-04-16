from __future__ import annotations
from flask import Blueprint, current_app, jsonify, request
from services.plaid_service import PlaidServiceError, build_plaid_service
from extensions import db
from models.plaid_item import PlaidItem

plaid_bp = Blueprint("plaid", __name__, url_prefix="/api/plaid")


def _get_current_user_id() -> str:

    user_id = request.headers.get("X-User-Id")
    if not user_id:
        raise ValueError("Missing authenticated user id")
    return str(user_id)


def _get_service():
    return build_plaid_service(current_app.config)


@plaid_bp.post("/create-link-token")
def create_link_token():
    try:
        user_id = _get_current_user_id()
        plaid_service = _get_service()

        response = plaid_service.create_link_token(user_id=user_id)

        return jsonify({
            "link_token": response["link_token"],
            "expiration": response.get("expiration"),
            "request_id": response.get("request_id"),
        }), 200

    except PlaidServiceError as exc:
        return jsonify(exc.to_dict()), exc.status_code or 500
    except Exception as exc:
        return jsonify({"error": {"message": str(exc)}}), 400


@plaid_bp.post("/exchange-public-token")
def exchange_public_token():
    try:
        user_id = _get_current_user_id()
        plaid_service = _get_service()

        data = request.get_json(silent=True) or {}
        public_token = data.get("public_token")

        if not public_token:
            return jsonify({
                "error": {"message": "public_token is required"}
            }), 400

        token_response = plaid_service.exchange_public_token(
            public_token=public_token
        )

        plaid_item = PlaidItem.query.filter_by(user_id=user_id).first()

        if plaid_item is None:
            plaid_item = PlaidItem(
                user_id=user_id,
                item_id=token_response["item_id"],
                access_token=token_response["access_token"],
                cursor=None,
            )
            db.session.add(plaid_item)
        else:
            plaid_item.item_id = token_response["item_id"]
            plaid_item.access_token = token_response["access_token"]
            plaid_item.cursor = None

        db.session.commit()

        return jsonify({
            "success": True,
            "item_id": token_response["item_id"],
            "request_id": token_response.get("request_id"),
        }), 200

    except PlaidServiceError as exc:
        db.session.rollback()
        return jsonify(exc.to_dict()), exc.status_code or 500
    except Exception as exc:
        db.session.rollback()
        return jsonify({"error": {"message": str(exc)}}), 400


@plaid_bp.get("/transactions")
def get_transactions():
    try:
        user_id = _get_current_user_id()
        plaid_service = _get_service()

        plaid_item = PlaidItem.query.filter_by(user_id=user_id).first()
        if plaid_item is None:
            return jsonify({
                "error": {"message": "No Plaid item linked for this user"}
            }), 404

        result = plaid_service.get_normalized_transactions(
            access_token=plaid_item.access_token,
            cursor=plaid_item.cursor,
        )

        plaid_item.cursor = result["next_cursor"]
        db.session.commit()

        return jsonify({
            "added": result["added"],
            "modified": result["modified"],
            "removed": result["removed"],
            "next_cursor": result["next_cursor"],
        }), 200

    except PlaidServiceError as exc:
        db.session.rollback()
        return jsonify(exc.to_dict()), exc.status_code or 500
    except Exception as exc:
        db.session.rollback()
        return jsonify({"error": {"message": str(exc)}}), 400
    global user_token
    global user_id
    try:
        # Build request based on whether we have user_token or user_id
        cra_products = ["cra_base_report", "cra_income_insights", "cra_partner_insights"]
        is_cra = any(product in cra_products for product in PLAID_PRODUCTS)

        if is_cra and user_id and not user_token:
            # For user_id, don't include user field
            request = LinkTokenCreateRequest(
                products=products,
                client_name="Plaid Quickstart",
                country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
                language='en'
            )
        else:
            # For user_token or non-CRA products, include user field
            request = LinkTokenCreateRequest(
                products=products,
                client_name="Plaid Quickstart",
                country_codes=list(map(lambda x: CountryCode(x), PLAID_COUNTRY_CODES)),
                language='en',
                user=LinkTokenCreateRequestUser(
                    client_user_id=str(time.time())
                )
            )

        if PLAID_REDIRECT_URI!=None:
            request['redirect_uri']=PLAID_REDIRECT_URI
        if Products('statements') in products:
            statements=LinkTokenCreateRequestStatements(
                end_date=date.today(),
                start_date=date.today()-timedelta(days=30)
            )
            request['statements']=statements

        if is_cra:
            # Use user_token if available, otherwise use user_id
            if user_token:
                request['user_token'] = user_token
            elif user_id:
                request['user_id'] = user_id
            request['consumer_report_permissible_purpose'] = ConsumerReportPermissiblePurpose('ACCOUNT_REVIEW_CREDIT')
            request['cra_options'] = LinkTokenCreateRequestCraOptions(
                days_requested=60
            )
    # create link token
        response = client.link_token_create(request)
        return jsonify(response.to_dict())
    except plaid.ApiException as e:
        print(e)
        return json.loads(e.body)