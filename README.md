# TicketChain_prototype2
This is a simple prototype #2 for TicketsCloud company.

## How to install:
Run ```npm install```

## How to run
Run ```npm run kovan```

## How to run on Heroku
1. Deploy to Heroku
2. Select 'nodejs' buildpack
3. Set SMART_CONTRACTS_ENABLED, ETH_NODE, ETH_CREATOR_ADDRESS, CONTRACT_ADDRESS environment variables.

## API description
### POST /tickets/:id?auth_code=123123123123212123

* Устанавливает данные билета. 
* id указан всегда.
* Если билета нет — создаёт с указанным в URL id (ObjectId).
* Если билет уже есть - обновляет данные.
* Никаких ограничений на запись не надо.
* При каждом запросе переписываются все поля. Если каких-то полей нет, значит они должны быть удалены.

```js
{
    "status": "vacant" | "sold" | "removed",

    "serial": "AAA",
    "number": 12345678,  // int

    "seat_sector": "id",
    "seat_row": "10",  // string
    "seat_number": "15",  // string

    "customer": "id",
    "customer_name": "First Last",

    "event": "id",
    "event_title": "string",

    "category": "id",
    "category_name": "string",

    "order": "id",
    "price": 123465,  // int in cents
    "price_currency": "RUB",

    "updated_at": "2017-07-27 15:57:13",
    "contract_address: "0xe7962464741983eB4620DD0e2Aa6d572145bab0E",
    "contract_status: "pending" | "ok"
}
```


*Следующие поля управляются со стороны чейна:*
    * updated_at: время обработки запроса (можно указать время добавления в блок, например);
    * contract_address: адрес контракта;
    * contract_status: "pending" — ожидает добавления в блок, "ok" — добавлен.


### GET /tickets/:id?auth_code=123123123123212123

Возвращает всю информацию о билете.
