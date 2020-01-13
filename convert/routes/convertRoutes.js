var express = require('express');
var router = express.Router();
const https = require('https');
var app=express();
const xml2js = require('xml2js');
const parser = new xml2js.Parser({mergeAttrs: true});
var fs = require("fs");
const { check, validationResult } = require('express-validator');


router.post('/convert', [
    // amount must not be empty
    check('amount').not().isEmpty().withMessage('The amount must not be empty'),
    // date must not be empty
    check('reference_date', 'The date must not be empty').not().isEmpty(),
  
  ], function (req, res, next) {
    let amount= req.body.amount;
    let ref_date= req.body.reference_date;
    let src_currency= req.body.src_currency;
    let dest_currency= req.body.dest_currency;
    var result_amount = 0;
    var src_rate, dest_rate;
   
    const errors = validationResult(req);
    // reading and updating the xml file from server
    https.get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml", function(rest) {
      let data = '';
      rest.on('data', function(stream) {
          data += stream;
      });
      rest.on('end', function(){
        parser.parseString(data, function(error, result) {
            if(error === null) { 
                fs.writeFile("temp.xml", data, (err) => {
                    if (err) console.log(err);
                   console.log("Successfully Written to File.");
                 });
              // assigning source and destination rates according to matched currencies by iterating through xml file
              for( i=0; i< result['gesmes:Envelope']['Cube'][0]['Cube'].length; i++){
                if (result['gesmes:Envelope']['Cube'][0]['Cube'][i]['time'] == ref_date) {
                  //console.log(result['gesmes:Envelope']['Cube'][0]['Cube'][i]['time'])
                    for( j=0; j< result['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'].length; j++){
                              if (result['gesmes:Envelope']['Cube'][0]['Cube'][i]['Cube'][j]['currency'] == src_currency){
                              src_rate = result['gesmes:Envelope']['Cube'][0]['Cube'][i]['Cube'][j]['rate']; // source rate
                               
                              } else if (result['gesmes:Envelope']['Cube'][0]['Cube'][i]['Cube'][j]['currency'] == dest_currency){
                              dest_rate = result['gesmes:Envelope']['Cube'][0]['Cube'][i]['Cube'][j]['rate']; // destination rate
                              
                              }
                              }   
                            } else {
                              console.log('The given date is out of range');
                            }
                    }                  
            }
            // using saved local file in case there is error reading remotely
            else {
                 console.log(error);
            }           
        });
        // check if selected currency is Eur
        if (dest_currency == 'EUR')  {
          
          result_amount = (amount / src_rate).toFixed(2);
        } else if (src_currency == 'EUR'){
          result_amount = (amount * dest_rate).toFixed(2);     
  
        } else {
          result_amount = ((amount * dest_rate) / src_rate).toFixed(2);
        }
  
         if (!errors.isEmpty() || src_currency === dest_currency){
         
          res.render('convertView', { title: 'Currency Converter', errors: errors.array() });
        } else {
          res.render('resultView', { title: 'Currency Converter', amount: result_amount, currency: dest_currency });
        }
        
    });
   
  }); 
  
  })  
  router.get('/back', function (req, res) {
    res.redirect('/')
  }) 
  
  router.get('/', function (req, res) {
    res.render('convertView', { title: 'Currency' })
  })  
  
  router.get('/convert', function (req, res) {
    res.render('convertView', { title: 'Currency' })
  })

module.exports = router;