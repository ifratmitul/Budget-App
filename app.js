//Budget controller module
var budgetController  = (function(){

    var Expense = function(id, desc, value ){
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    var Income = function(id, desc, value ){
        this.id = id;
        this.desc = desc;
        this.value = value;
    }
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(element => {
            sum+=element.value;
        });
        data.totals[type] = sum;
        console.log(sum);
    }

    var data = {
         
         allItems : {
             exp : [],
             inc : []
         },

         totals: {
             exp : 0,
             inc : 0
         },
         budget : 0,
         percentage : -1

             
    }

    return {
        additem : function (type, desc, value){
            var newItem, Id;

            if(data.allItems[type].length > 0)
            {
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1; 
            }
            else Id  = 0;

            //console.log(Id)
            if(type === 'exp') 
            {   
                newItem = new Expense(Id, desc, value);
            }
            else if (type === 'inc') 
            {
                newItem = new Income(Id, desc, value);
            }

            data.allItems[type].push(newItem);
            //console.log(data);
            
            return newItem;

        },
        calculateBudget : function (){
            calculateTotal('inc');
            calculateTotal('exp');  
            data.budget = data.totals.inc - data.totals.exp; 
            if(data.totals.inc > 0) data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else data.percentage = -1;


        },
        getBudget : function (){
            return {
                budget : data.budget,
                percentage : data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,

            }
        },

        test : function(){
            console.log(data);
        }
    }

    
})();



//UI Controller module
var UIController = (function(){

    var DOMstrings = {
        inputType :  '.add__type',
        inputDescription : '.add__description',
        inputValue :  '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        expensesPercLabel: '.item__percentage',
    };
    

        return{
            getinput : function(){
                return{

                    type : document.querySelector(DOMstrings.inputType).value,
                    description : document.querySelector(DOMstrings.inputDescription).value,
                    value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
                }
            },

            addListItem: function(obj, type){

                var html, newhtml, element;
                if (type === 'inc') {
                    element = DOMstrings.incomeContainer;
                    
                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp') {
                    element = DOMstrings.expenseContainer;
                    
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                newhtml = html.replace('%id%', obj.id);
                newhtml = newhtml.replace('%description%',obj.desc);
                newhtml = newhtml.replace('%value%',obj.value);

                document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);


            },
            clearFields : function (){
                var fields, fieldsArr;
            
                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
                fieldsArr = Array.prototype.slice.call(fields);
              
                fieldsArr.forEach(function(current, index, array) {
                    current.value = "";
                });
                
                fieldsArr[0].focus();
            },

            dispalayBudget : function (obj) {

                 document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
                 document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
                 document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
                
                if(obj.percentage > 0 )  
                {
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + ' %';
                }
                    else  document.querySelector(DOMstrings.percentageLabel).textContent = '----';
            },

            getDomstrings: function(){
                return DOMstrings;
            }
        }
    

})();



var controller = (function(budgetC, uiC){



    var setupEventListener = function (){
        var DOM = uiC.getDomstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctraddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13) 
            {
                ctraddItem();
            }
        })
    }

    var updateBudget = function(){
        budgetC.calculateBudget();

        var budget = budgetC.getBudget();
        console.log(budget);
        uiC.dispalayBudget(budget)
    }

    var ctraddItem = function(){
        var input, newitem;
        input =  uiC.getinput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            console.log(input);
            newitem = budgetC.additem(input.type, input.description, input.value);
            uiC.addListItem(newitem, input.type)
    
            uiC.clearFields();
            updateBudget();
        }
        


    }

    return {
        init : function (){
            console.log('Starting Application')
            uiC.dispalayBudget({
                budget : 0,
                totalExp: 0,
                totalInc: 0,
                percentage: -1,
            });
            setupEventListener();
            
        }
    }





})(budgetController, UIController);



controller.init();