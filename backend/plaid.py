import plaid
from plaid.api import plaid_api
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest





def initialize_plaid_client():
    # the public token is received from Plaid Link
    exchange_request = ItemPublicTokenExchangeRequest(
        public_token=pt_response['public_token']
    )
    exchange_response = client.item_public_token_exchange(exchange_request)
    access_token = exchange_response['access_token']
    return access_token



request = TransactionsSyncRequest(
    access_token=access_token,
)
response = client.transactions_sync(request)
transactions = response['added']
//Extract transaction data


# the transactions in the response are paginated, so make multiple calls while incrementing the cursor to
# retrieve all transactions
while (response['has_more']):
    request = TransactionsSyncRequest(
        access_token=access_token,
        cursor=response['next_cursor']
    )
    response = client.transactions_sync(request)
    transactions += response['added']