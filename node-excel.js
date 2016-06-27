var xlsx = require("node-xlsx");
var dbClient = require("./Mongo");  //数据库模块

function importStationFromExcel( importFileName, response )
{
		var excelObj  = xlsx.parse( "./upload/"+importFileName );

		console.log(excelObj );
		var isWellFinished = true;
		
		var sheetData = excelObj[0].data; 
		var rowCount = sheetData.length;

		var firstRowData = sheetData[0]; 
		//excel格式判断
		if( firstRowData[0].toString() != '基站ID' || firstRowData[1].toString() != '基站地址' || firstRowData[2].toString() != '锁ID' ||
		firstRowData[3].toString() != '基站负责人' || firstRowData[4].toString() != '基站所属省份' || firstRowData[5].toString() != '基站所属市级区域'  || 
		firstRowData[6].toString() != '基站所属地级区域' || firstRowData[7].toString() != '基站审批人' )
		{
				var failedInfo = 	{ "error":  
				{  
					"msg": "数据导入失败,基站数据格式错误",  
					"code":"28002"  
				}  };
				
				response.write( JSON.stringify(failedInfo) );
				response.end();
				return;
		}

		var mongoClient = require('mongodb').MongoClient;
		var DB_CONN_STR = 'mongodb://localhost:27017/csis';	
		var collectionName = "stationInfo";

		//逐条插入数据到数据库

		for (var i = 1; i < rowCount; i++) 
		{
			var rowData = sheetData[i]; 
			var columnCount = rowData.length;
			var field = {};


			field.stationID  = rowData[0].toString();
			field.address  = rowData[1].toString();
			field.lockID  = rowData[2].toString();
			field.chargePerson  = rowData[3].toString();
			field.managementProvince  = rowData[4].toString();
			field.managementCity  = rowData[5].toString();
			field.managementArea  = rowData[6].toString();
			field.approvalPerson  = rowData[7].toString();
			
			//要注意异步编程的特性
			dbClient.insertFunc( mongoClient, DB_CONN_STR, collectionName,  field, function(result){
					if( result.hasOwnProperty("errmsg") )
					{
						if(isWellFinished == true)
						{
							var failedInfo = 	{ "error":  
							{  
								"msg": "数据导入失败,基站数据有重复",  
								"code":"28003"  
							}  };
							
							response.write( JSON.stringify(failedInfo) );
							response.end();
						}
						isWellFinished = false;
					}

					if( isWellFinished == true && i==(rowCount-1) )
					{
							var Info = 	{ "success":  
							{  
								"msg": "数据导入成功",  
								"code":"28000"  
							}  };
							
							response.write( JSON.stringify(Info) );
							response.end();		
					}
					console.log(result);
			});	

			console.log(field);

		}
	
}



function importKeyFromExcel( importFileName, response )
{
		var excelObj  = xlsx.parse(  "./upload/" + importFileName );
		var isWellFinished = true;
		console.log(excelObj );

		//[ { name: 'Sheet1', data: [ [Object] ] } ]

		var sheetData = excelObj[0].data; 
		var rowCount = sheetData.length;

		var firstRowData = sheetData[0]; 
		//excel格式判断
		if( firstRowData[0].toString() != '电子钥匙ID' || 
		firstRowData[1].toString() != '电子钥匙管理省份' || 
		firstRowData[2].toString() != '电子钥匙管理市级区域' ||
		firstRowData[3].toString() != '电子钥匙管理地级区域' )
		{
				var failedInfo = 	{ "error":  
				{  
					"msg": "数据导入失败,电子钥匙数据格式错误",  
					"code":"28004"  
				}  };
				
				response.write( JSON.stringify(failedInfo) );
				response.end();
				return;
		}

		var mongoClient = require('mongodb').MongoClient;
		var DB_CONN_STR = 'mongodb://localhost:27017/csis';	
		var collectionName = "keyInfo";

		//逐条插入数据到数据库
		for (var i = 1; i < rowCount; i++) 
		{
			var rowData = sheetData[i]; 
			var columnCount = rowData.length;
			var field = {};


			field.keyID  = rowData[0].toString();
			field.managementProvince  = rowData[1].toString();
			field.managementCity  = rowData[2].toString();
			field.managementArea  = rowData[3].toString();

			//要注意异步编程的特性
			dbClient.insertFunc( mongoClient, DB_CONN_STR, collectionName,  field, function(result){
					if( result.hasOwnProperty("errmsg") )
					{
						if(isWellFinished == true)
						{
							var failedInfo = 	{ "error":  
							{  
								"msg": "数据导入失败,电子钥匙数据有重复",  
								"code":"28005"  
							}  };
							
							response.write( JSON.stringify(failedInfo) );
							response.end();
						}
						isWellFinished = false;
					}

					if( isWellFinished == true && i==(rowCount-1) )
					{
							var Info = 	{ "success":  
							{  
								"msg": "数据导入成功",  
								"code":"28000"  
							}  };
							
							response.write( JSON.stringify(Info) );
							response.end();		
					}
					console.log(result);

			});	
			
			console.log(field);
				
		}
			  
}




//---------------------开始--模块导出接口声明--开始--------------------//
exports.importStationFromExcel = importStationFromExcel;
exports.importKeyFromExcel = importKeyFromExcel;
//---------------------结束--模块导出接口声明--结束--------------------//