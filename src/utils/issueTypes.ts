export const ISSUE_TYPES = [
  {
    key: "002",
    value: "Item",
    subCategory: [
      {
        key: "01",
        value: "Missing items",
        enums: "ITM01"
      },
      {
        key: "02",
        value: "Quantity issue",
        enums: "ITM02"
      },
      {
        key: "03",
        value: "Item mismatch",
        enums: "ITM03"
      },
      {
        key: "04",
        value: "Quality issue",
        enums: "ITM04"
      },
      {
        key: "05",
        value: "Expired item",
        enums: "ITM05"
      }
    ]
  },
  {
    key: "003",
    value: "Fulfillment",
    subCategory: [
      {
        key: "01",
        value: "Wrong delivery address",
        enums: "FLM01"
      },
      {
        key: "02",
        value: "Delay in delivery",
        enums: "FLM02"
      },
      {
        key: "03",
        value: "Delayed delivery",
        enums: "FLM03"
      },
      {
        key: "04",
        value: "Packaging",
        enums: "FLM04"
      },
      // {
      //     key: '05',
      //     value: 'Buyer not found',
      //     enums: 'FLM05'
      // }, {
      //     key: '06',
      //     value: 'Seller not found',
      //     enums: 'FLM06'
      // },
      {
        key: "07",
        value: "Package info mismatch",
        enums: "FLM07"
      },
      {
        key: "08",
        value: "Incorrectly marked as delivered",
        enums: "FLM08"
      }
    ]
  }
];
