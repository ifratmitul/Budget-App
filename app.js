//Budget controller module
var budgetController = (function () {
  var Expense = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.CalPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = -1;
  };

  Expense.prototype.getPercetnage = function () {
    return this.percentage;
  };

  var Income = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach((element) => {
      sum += element.value;
    });
    data.totals[type] = sum;
    //console.log(sum);
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },

    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    additem: function (type, desc, value) {
      var newItem, Id;

      if (data.allItems[type].length > 0) {
        Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else Id = 0;

      //console.log(Id)
      if (type === "exp") {
        newItem = new Expense(Id, desc, value);
      } else if (type === "inc") {
        newItem = new Income(Id, desc, value);
      }

      data.allItems[type].push(newItem);
      //console.log(data);

      return newItem;
    },
    deleteItem: function (type, id) {
      var ids = data.allItems[type].map(function (curr) {
        return curr.id;
      });
      console.log(ids);
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      calculateTotal("inc");
      calculateTotal("exp");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0)
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.percentage = -1;
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (curr) {
        curr.CalPercentage(data.totals.inc);
      });
    },

    getPercet: function () {
      var allPercentages = data.allItems.exp.map(function (curr) {
        return curr.getPercetnage();
      });
      return allPercentages;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    test: function () {
      console.log(data);
    },
  };
})();

//UI Controller module
var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    expensesPercLabel: ".item__percentage",
    container: ".container",
    dateLabel: ".budget__title--month",
  };

  formatNumber = function (num, type) {
    num = Math.abs(num);
    num = num.toFixed(2);
    var numSplit = num.split(".");
    var int = numSplit[0];
    var dec = numSplit[1];
    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  //console.log("From Display Percentage:  " + fields);
  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );

      document.querySelector(DOMstrings.inputButton).classList.toggle("red");

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle("red-focus");
      });
    },

    addListItem: function (obj, type) {
      var html, newhtml, element;
      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newhtml = html.replace("%id%", obj.id);
      newhtml = newhtml.replace("%description%", obj.desc);
      newhtml = newhtml.replace("%value%", formatNumber(obj.value, type));

      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    },

    deleteListItem: function (selectorId) {
      var element = document.getElementById(selectorId);
      element.parentNode.removeChild(element);
    },
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },
    displayMonth: function () {
      var now = new Date();
      var year, month, months;

      year = now.getFullYear();
      month = now.getMonth();

      document.querySelector(DOMstrings.dateLabel).textContent =
        month + " " + year;

      // document.querySelector(DOMstrings.dateLabel).textContent = year;
    },

    dispalayBudget: function (obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expenseLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + " %";
      } else
        document.querySelector(DOMstrings.percentageLabel).textContent = "----";
    },

    displayPercentage: function (percentage) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function (current, index) {
        if (percentage[index] > 0)
          current.textContent = percentage[index] + " %";
        else current.textContent = "----";
      });
    },

    getDomstrings: function () {
      return DOMstrings;
    },
  };
})();

var controller = (function (budgetC, uiC) {
  var setupEventListener = function () {
    var DOM = uiC.getDomstrings();
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctraddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctraddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiC.changeType);
  };

  var updatePercentages = function () {
    budgetC.calculatePercentages();
    var percentages = budgetC.getPercet();
    console.log(percentages);
    uiC.displayPercentage(percentages);
  };

  var updateBudget = function () {
    budgetC.calculateBudget();

    var budget = budgetC.getBudget();
    //  console.log(budget);
    uiC.dispalayBudget(budget);
  };

  var ctraddItem = function () {
    var input, newitem;
    input = uiC.getinput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      console.log(input);
      newitem = budgetC.additem(input.type, input.description, input.value);
      uiC.addListItem(newitem, input.type);

      uiC.clearFields();
      updateBudget();
      updatePercentages();
    }
  };
  var ctrDeleteItem = function (event) {
    var splitID, type, ID;
    var item = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (item) {
      splitID = item.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      console.log("ID is : " + ID);
      budgetC.deleteItem(type, ID);
      uiC.deleteListItem(item);
      updateBudget();
      updatePercentages();
    }
  };
  return {
    init: function () {
      console.log("Starting Application");
      uiC.dispalayBudget({
        budget: 0,
        totalExp: 0,
        totalInc: 0,
        percentage: -1,
      });
      setupEventListener();
      uiC.displayMonth();
    },
  };
})(budgetController, UIController);

controller.init();
