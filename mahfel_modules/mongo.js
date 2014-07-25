var MongoClient = require('mongodb').MongoClient;
var exec = require('child_process').exec;
async=require("async");


function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

exports.connect=function(callback){
    var mthis=this;
    MongoClient.connect("mongodb://127.0.0.1:27017/mahfel", function(err, mdb) {
	if(err) throw err;
	mthis.db=mdb;
	callback();
    });
};

exports.db=null;

exports.insertOrUpdateObject=function(collectionName,obj,uniqCol,callback){
    var collection=mongo.db.collection(collectionName);
    var addobj=function(obj){
	//add crawl date for every object
	obj.lastCrawl=new Date();
	find={};
	find[uniqCol]=obj[uniqCol];

	collection.find(find).toArray(function(err,findrec){
	    if(findrec.length==0){
		console.log("insert new Object : "+obj[uniqCol]);		    
		collection.insert(obj,function(err,records){
		callback(err);
		});
	    }else{
		console.log("Update Object : "+obj[uniqCol]);
		collection.update(find,{
		    '$set':obj
		},function(err){
		   callback(err); 
		});
	    }
	});
    };
    if (obj.localImage==undefined && obj.image !="" && obj.image!=undefined ) {
	//fetch image
	ext=undefined;
	if (obj.imageExt!=undefined) {
	    ext=obj.imageExt;
	}
	console.log("fetch Image :"+obj.image);
	downloadImage(obj.image,config.otherConf.imagesdir,
					function(localImage){
						obj.localImage=localImage;
						//if (localImage!="" && obj.siteid==1) {
						//    //remove borders using image magick
						//    console.log("Crop image from ketab.ir");
						//    command="convert images/"+localImage+"  -gravity South  -chop  0x20  images/"+localImage;
						//    exec(command, function (error,stdout,stderror){
						//    });
						//}
						addobj(obj);
					},ext);
    }else{
	addobj(obj);
    }
};


exports.openVote=function(obj,callback){
    var collection=mongo.db.collection('votes');
    var addobj=function(obj){
	obj.createDate=new Date();
	find={'user':obj.user , 'type':obj.type};
	collection.find(find).toArray(function(err,findrec){
	    if(findrec.length==0){
		obj.status='open'
		obj.voteNum=0
		obj.totalPoint=0
		collection.insert(obj,function(err,records){
		callback("vote opened successfully with id :"+records[0]['_id']);
		});
	    }else{
		callback("this vote already exist! id: "+findrec[0]['_id']); 
	    }
	});
    };
    addobj(obj);
};