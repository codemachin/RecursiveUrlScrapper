var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// schema for url table
var urlSchema = new Schema({

  url : {type:String,default:"",required:true,index:true,unique:true},
  referenceCount : {type:Number,default:1,required:true},
  parameters : [{type:String}],
  created : {type:Date,default:Date.now}

});

mongoose.model('Urls',urlSchema);