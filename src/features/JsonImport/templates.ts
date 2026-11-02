import type { Kind,Data } from './schema';
export const TEMPLATES:Record<Kind,Data>={
 news:{title:'Прогулка у набережной',description:'Идея для спокойного выходного.',content:[{type:'heading',level:2,content:'С чего начать'},{type:'text',content:'Выберите удобную точку начала и оставьте время на отдых.'}]},
 stories:{name:'Городская прогулка',is_active:true,expires_at:null,content_items:[{type:'image',content:'https://example.com/replace-with-your-slide.jpg',duration:5}]},
 points:{name:'Остановка у набережной',description:'Место для короткой паузы.',latitude:53.9,longitude:27.56,is_partner:false,budget:0,content_data:{content:[{type:'text',content:'Посмотрите на город с новой стороны.'}]}},
 categories:{name:'Прогулки у воды',description:'Маршруты вдоль набережной.'},
 routes:{name:'Короткий маршрут',description:'Прогулка с двумя остановками.',route_category_id:1,points:[1,2],distance:1500,estimated_time:30,budget:0},
 topics:{name:'Как исследовать город',description:'Короткий курс о городских прогулках.',experience_points:50,order:1},
 subtopics:{name:'Подготовка к прогулке',description:'Выбираем цель и удобный темп.',experience_points:10,order:1},
 pages:{page_number:1,content:[{type:'heading',level:2,content:'Цель прогулки'},{type:'text',content:'Решите, что вы хотите увидеть.'},{type:'test',question:'Что учитывать при планировании?',options:[{id:'a',text:'Цель и возможности участников'},{id:'b',text:'Только расстояние'}],correct_option_id:'a',message:'Маршрут должен быть удобен всем участникам.'}]},
 achievements:{name:'Первые пять мест',description:'Посетите пять точек.',achievement_type:'points_visited',criteria_value:5,criteria_unit:'мест'},
};
export const BULK_TEMPLATE={version:1,records:[
 {type:'categories',key:'water',data:TEMPLATES.categories},
 {type:'points',key:'river',data:TEMPLATES.points},
 {type:'routes',key:'walk',data:{...TEMPLATES.routes,route_category_id:'water',points:['river']}},
 {type:'news',key:'weekend',data:TEMPLATES.news},
 {type:'topics',key:'city',data:TEMPLATES.topics},
 {type:'subtopics',key:'prepare',data:{...TEMPLATES.subtopics,topic_id:'city'}},
 {type:'pages',key:'lesson',data:{...TEMPLATES.pages,subtopic_id:'prepare'}},
 {type:'achievements',key:'five-places',data:TEMPLATES.achievements},
]};
