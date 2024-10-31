```json
// 查询逻辑符号 op = and || or，
反之 op = term(精确匹配),
match(模糊匹配),
multi_match(不指定字段查，key为空),
range(查询范围: value: [1, 2] 第一个表示大于  第二个表示小于  可为空)
query可以一直嵌套
{
  "cmd": "string",
  "env": "string",
  "request": {
    "limit": 0,
    "list_all": true,
    "offset": 0,
    "order_by": [
      "string"
    ],

    "query": {
      "exprs": [
        "query":{},
        "query":{},
      ],
      "key": "string",
      "op": "string",
      "value": [
        "string"
      ]
    }
  }
}

eg:
查询 name:a or name:b and age:18
{
	"query":{
		"op": "or",
		"exprs": [
			"query":{
				"op": "match",
				"key":"name",
				"val": ["a"]
			},
			"query": {
				"op": "and",
				"exprs":[
					"query":{
						"op": "match",
						"key":"name",
						"val": ["b"]
					},
					"query":{
						"op": "match",
						"key":"age",
						"val": ["18"]
					},
				]
			}
		]
	}
}
```
