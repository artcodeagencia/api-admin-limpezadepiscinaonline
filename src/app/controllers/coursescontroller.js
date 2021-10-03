const { courses } = require('../models');
const dayjs = require('dayjs');

function lotAdjust(data){

  var discount_value = 50 // Desconto de 50 reais para cada lote
  var interval_value = 15;
  var lot_length = data.length;
  data.forEach((element, index) => {
    element.lote = lot_length - index;
    let discount_value_calc = element.value - (discount_value * index);
    if(discount_value_calc < 0) discount_value_calc = 0;
    element.value = discount_value_calc;
    
    var d = new Date(dayjs(element.date).format('YYYY/MM/DD'));
    element.date = dayjs(d).subtract((interval_value * index), 'day');
    element.date = dayjs(element.date).format('DD/MM/YYYY');
  });
 
  return data;
}

class CourseController {

  async getCourses(req, res) {

    var coursesSelect = await courses.findAll();
       var coursesActual = JSON.parse(JSON.stringify(coursesSelect));
       var index = 0;
    
      coursesActual.forEach(element => {

         var temp_full_lot = [];

          for(let i = 0; i < element.lot; i++){
          
            var temp_lot = {
              lote: i +1,
              value: element.value,
              date: element.date
            };
            
            temp_full_lot.push(temp_lot);
          }
    
          temp_full_lot = lotAdjust(temp_full_lot).reverse();
          element.lotes = temp_full_lot;
          index++;
      });

    return res.status(200).json({ body: coursesActual });
  }

  async updateCourses(req, res) {
    const value = req.body;
    const coursesUpdate = await courses.update(value, {
      where: {
        id: value.id
      }
    })
    const response = coursesUpdate[0];
    let body, error;
    if(response) {
      error = 0;
      body = "Informações atualizadas com sucesso";
    } else {
      error = 1;
      body = "Não foi possível atualizar as informações. Contate a administração.";
    }
    return res.status(200).json({ error, body})
  }

  async updateList(req, res){
    const data = req.body;
    let temp_full_lot = lotAdjust(data).reverse();
    return res.status(200).json({ body: temp_full_lot}) 
  }
}

module.exports = new CourseController()
