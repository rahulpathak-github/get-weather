const express=require('express')
const path=require('path')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')

const app=express()

//define paths for express config
const publicDirectoryPath=path.join(__dirname,'../public')
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')
//set up handlebars and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)
//set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{

        title:'Weather',
        name:'Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help',
        helpText:'You really need help with such a simple interface!??',
        name:'Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar'

    })
})

app.get('/weather',(req,res)=>{
    
    if(!req.query.address){
        return res.send({
            error:'You must provide an address'
        })
    }
        geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
            if(error){
                return res.send({error})
            }
            forecast(latitude,longitude,(error,forecastData)=>{
                if(error){
                    res.send({error})
                }
                res.send({
                    forecast:forecastData,
                    location,
                    address:req.query.address 
                })
            })

        })


   
})

app.get('/help/*',(req,res)=>{
   res.render('404',{
       title:'404 help',
       name:'Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar',
       errorMessage:'Help article not found!'
   })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'Rahul Pathak, CSE undergraduate  at IIT Bhubaneswar',
        errorMessage:'page not found!'
    })
})

app.listen(3000,()=>{
    console.log('server id up and running on port 3000')
})