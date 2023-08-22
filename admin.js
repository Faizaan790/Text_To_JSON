const socket = io();
const carousal = document.querySelector('.carousel-inner');

const sortedData =(data)=>(data.sort((a, b) => { return a.unit_number - b.unit_number  }))

fetch('http://127.0.0.1:8080/data')
.then(data => 
    data.json()
)
.then(data=>{
    if(data){
        updateDom(sortedData(data))
    }else{
        updateDom([])
    }
})
.catch((error) => {
    console.error('Error:', error);
});


const addItem = (item, ind) => {
    const carousalItem = 
    `<div class="carousel-item ${'itm-cr'+item.unit_number} ${ind===0?'active':''}">
     <div class="card" style="width: 25rem; height:auto">
      <div class="card-body">
        <h5 class="card-title text-center"><strong>UNIT NUMBER:</strong> ${item.unit_number}</h5>
        <h6><strong>Unit Name: </strong><span>${item.unit_name}</span></h6>
        <hr>
        <h5 class="text-center"><strong>TOPICS</strong></h5>
        <div class="Topics${item.unit_number}"></div>
      </div>
      </div>
      `;
      carousal.innerHTML+=carousalItem;
      const car_Item = document.querySelector('.itm-cr'+item.unit_number);
      
      const Topics = car_Item.querySelector('.Topics'+item.unit_number);

      item.topics.forEach((el,i)=>{
        const topic = `
            <div class="topic${i+1}_Unit${item.unit_number}">
                <div className="topicName"><h7><strong>TOPIC NAME:</strong> ${el.topic_name}</h7></div>
                <div className="topicName"><h7>TOPIC NO: ${el.topic_number}</h7></div>
                
                <div className="content_Items">

                </div>
            </div>
            <hr>

        `;
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';
        topicDiv.innerHTML = topic;
        Topics.appendChild(topicDiv);


        const contents = Topics.querySelector(`.topic${i+1}_Unit${item.unit_number}`);   

        el.contents.forEach((itm,j)=>{
          const cnt =
          `<div class="panel-group">
              <div class="panel panel-default">
              <div class="panel-heading">
                  <div class="panel-title">
                  <a data-toggle="collapse" href="#collapse_unit${item.unit_number}_topic${i}_content${j}">Content-${j+1}</a>
                  </div>
              </div>
              <div id="collapse_unit${item.unit_number}_topic${i}_content${j}" class="panel-collapse collapse">
                  <div class="panel-body">
                      <strong>Question: </strong>${itm.question}
                      <p><strong>Text: </strong>${itm.text}</p>
                  </div>
                  <div class="panel-footer">
                      <p><strong>Alt Questions: </strong>
                          <ol class="alternate_Questions">
                          </ol>
                      </p>
                      <p><strong>Alt Text: </strong>${itm.text_alt.toString()}</p>
                      <p><strong>Keywords: </strong>${itm.keywords.toString()}</p>
                  </div>
              </div>
              </div>
          </div>`;
          contents.innerHTML+=cnt;
          
          const OrderedList = document.querySelector(`#collapse_unit${item.unit_number}_topic${i}_content${j} .alternate_Questions`);
  
          itm.alt_questions?.forEach((d)=>{
              OrderedList.innerHTML += `<li>${d}</li>`
          })
        })
        // Topics.appendChild(topicDiv);
      })

    }

socket.on('updatedData', function(data) {
    // console.log('data updated in admin');
    carousal.innerHTML='';
    updateDom(sortedData(data))
});

const updateDom =(data) =>{
    // console.log(data)
    data.forEach((item,index)=>{
        addItem(item,index);
    })
}
