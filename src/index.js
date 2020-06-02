const debitInputsContent = document.querySelector(".debit-inputs");
const creditInputsContent = document.querySelector(".credit-inputs");
//container for saves
let savesContainer = document.querySelector(".saves-container");
//

class inputs {
  constructor(container, contentFormName, inputClass, deleteButton, options) {
    this.container = container;
    this.inputClass = inputClass;
    this.options = options;
    this.contentFormName = contentFormName;
    this.deleteButton = deleteButton;
  }
  getOption() {
    let option = ``;
    for (let i of this.options) {
      let value = `<option>${i}</option>`;
      option += value;
    }
    return option;
  }

  createInputs() {
    this.container.insertAdjacentHTML(
      "afterbegin",
      ` <div class="${
        this.contentFormName
      }"> <select>${this.getOption()}</select><input class="${
        this.inputClass
      }"><button class="${this.deleteButton}">delete</button></div>`
    );
  }
  deleteInputs() {
    let deleteButton = document.querySelector(`.${this.deleteButton}`);
    deleteButton.addEventListener("click", () => {
      deleteButton.parentElement.remove();
    });
  }
}

let debitCategory = ["salary", "helps", "prezent", "other"];
let creditCategory = [
  "luxary-stuff",
  "helps",
  "food",
  "hous",
  "transport",
  "sport",
];

let ExpendedDebitCategory = JSON.parse(JSON.stringify(debitCategory));
let ExpendedCreditCategory = JSON.parse(JSON.stringify(creditCategory));
let LSDebitCategory = [];
let LSCreditCategory = [];

// get from ls
function changeArrOfcategories(oldArr, newArr, firstLater) {
  for (let i in localStorage) {
    oldArr.push(i);
  }
  for (let r = 0; r < oldArr.length; r++) {
    if (oldArr[r][0] === `${firstLater}`) {
      let key = oldArr[r];
      let infoFromLS = localStorage.getItem([key]);
      console.log(infoFromLS);
      if (infoFromLS !== "null") {
        newArr.push(infoFromLS);
      }
    }
  }
  console.log(newArr);
}
changeArrOfcategories(LSDebitCategory, ExpendedDebitCategory, "d");
changeArrOfcategories(LSCreditCategory, ExpendedCreditCategory, "c");

//save on LS
function addCtegoryToLS(classOfbutton, category, original) {
  let buttonAddDebitCategory = document.querySelector(`.${classOfbutton}`);
  buttonAddDebitCategory.addEventListener("click", rea);

  function rea() {
    let randomDebit = `${category}:` + Math.random().toFixed(3);
    let newCategory = prompt(`add new category for ${category}:`);
    let result = `${randomDebit}`;
    console.log(result);
    localStorage.setItem(`${result}`, `${newCategory}`);
    original.push(newCategory);
  }
}
addCtegoryToLS("add-debit-category", "debit", debitCategory);
addCtegoryToLS("add-credit-category", "credit", creditCategory);
//WHYYYYYYYYYYYYYYYYYYYYYYYY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

ExpendedCreditCategory.splice(ExpendedCreditCategory.length - 1, 1);

console.log(ExpendedDebitCategory);
let inputsDebit = new inputs(
  debitInputsContent,
  "debit-container-form",
  "debit-input",
  "deleteButton",
  ExpendedDebitCategory
);
let inputsCredit = new inputs(
  creditInputsContent,
  "credit-container-form",
  "credit-input",
  "deleteButton-2",
  ExpendedCreditCategory
);

inputsCredit.createInputs();
inputsCredit.deleteInputs();

inputsDebit.createInputs();
inputsDebit.deleteInputs();

const addNewDebitInput = document.querySelector(".add-debit-input");
const addNewCreditInput = document.querySelector(".add-credit-input");

addNewDebitInput.addEventListener("click", () => {
  inputsDebit.createInputs();
  inputsDebit.deleteInputs();
});
addNewCreditInput.addEventListener("click", () => {
  inputsCredit.createInputs();
  inputsCredit.deleteInputs();
});
//atempt
//console.log(inputsCredit.options);
const getResultWraper = document.querySelector(".get-result-wraper");
getResultWraper.addEventListener("click", starSortInfo);

//

class sortInfo {
  constructor(masiveOptons, inputsName) {
    this.masiveOptons = masiveOptons;
    this.inputsName = inputsName;
  }
  //total info from inputs
  createInputsArr() {
    let infoArr = document.querySelectorAll(`.${this.inputsName}`);
    let comonArr = [];
    for (let i of infoArr) {
      let selectValue = i.parentElement.childNodes[1].value;
      comonArr.push({ [selectValue]: i.value });
    }
    return comonArr;
  }
  getOptions() {
    let mainArr = [];
    for (let i of this.masiveOptons) {
      mainArr.push(i);
    }
    return mainArr;
  }
  // create "litle" object
  count(arr) {
    let name = arr[0];
    arr[0] = {};
    let val = 0;
    for (let i = 1; i < arr.length; i++) {
      let needValue = parseFloat(arr[i][name]);
      if (needValue > -1) {
        console.log("ks");
        val += parseFloat(needValue);
      } else val += 0;
    }
    return { val };
    console.log({ val });
  } // transform object into arr
  reformObj(arr) {
    let resultArr = [];
    for (let category in arr) {
      resultArr.push({ [category]: arr[category].val });
    }
    return resultArr;
  }
  //return normal arr for operation
  removeInfo() {
    let arrObj = this.createInputsArr();
    let optionArr = this.getOptions();
    let mainArr = {};
    for (let i in optionArr) {
      let res = arrObj.filter((res) => Object.keys(res) == `${optionArr[i]}`);

      res.unshift(`${optionArr[i]}`);

      mainArr[res[0]] = this.count(res);
    }

    let totalSum = this.sum(this.reformObj(mainArr));
    let resultArr = this.reformObj(mainArr);
    return { totalSum: totalSum, resultArr: resultArr };
  }
  sum(arr) {
    let totalSum = 0;
    for (let i in arr) {
      let name = Object.keys(arr[i])[0];
      totalSum += arr[i][name];
    }
    return totalSum;
  }
}

function starSortInfo() {
  let resultContent = document.querySelector(".result-content");
  let debitSort = new sortInfo(inputsDebit.options, "debit-input");
  let debitTotalSum = debitSort.removeInfo().totalSum;
  let debitResultArr = debitSort.removeInfo().resultArr;
  console.log(debitResultArr);

  let creditSort = new sortInfo(inputsCredit.options, "credit-input");
  let creditTotalSum = creditSort.removeInfo().totalSum;
  let creditResultArr = creditSort.removeInfo().resultArr;
  //create table of balance
  createBalanse(
    debitSort.removeInfo().totalSum,
    creditSort.removeInfo().totalSum,
    resultContent
  );

  let tablArr = [];
  tablArr.push(debitSort.removeInfo().totalSum);
  tablArr.push(creditSort.removeInfo().totalSum);
  localStorage.setItem("myItem", JSON.stringify(tablArr));

  let saveButton = document.querySelector(".save-result-button");
  saveButton.addEventListener("click", saveBalanseInfo);
  saveButton.addEventListener("click", CreateTemporarySaves);
  let randomId = "Id:" + Math.random().toFixed(3);

  let anotherCounter = 0;
  function CreateTemporarySaves() {
    anotherCounter += 1;
    if (anotherCounter < 3) {
      createBalanseForSaves(
        debitSort.removeInfo().totalSum,
        creditSort.removeInfo().totalSum,
        savesContainer,
        randomId
      );
    } else alert("You save info alredy");
  }

  function saveBalanseInfo() {
    anotherCounter += 1;
    if (anotherCounter < 4) {
      let needElement = JSON.parse(localStorage.getItem("myItem"));
      localStorage.setItem(`${randomId}`, JSON.stringify(needElement));
    } else console.log("now");
  }

  //
  resultContent.insertAdjacentHTML(
    "beforeend",
    `<div class="get-mor-info button-credit-wraper"><button class="add-credit-input">get more info</button></div>`
  );
  let buttonForTable = document.querySelector(".get-mor-info");
  buttonForTable.addEventListener("click", getTable);

  //this code create table
  let needDiv = document.querySelector(".get-mor-info");
  let tableSelector = document.createElement("select");
  tableSelector.classList.add("selector-for-table");
  needDiv.appendChild(tableSelector);
  tableSelector.insertAdjacentHTML(
    "beforeend",
    `<option>debit</option><option>credit</option>`
  );

  //information for table
  let sumgetTable;
  let arr;
  let table = document.createElement("table");
  table.classList.add("result-table");
  function getTable() {
    if (tableSelector.value == "debit") {
      sumgetTable = debitTotalSum;
      arr = debitResultArr;
      document
        .querySelector(".result-table")
        .style.setProperty("--border-style", "#b5ffbc");
    } else if (tableSelector.value == "credit") {
      sumgetTable = creditTotalSum;
      arr = creditResultArr;
      document
        .querySelector(".result-table")
        .style.setProperty("--border-style", "#ffcfcf");
    }

    //var copy = JSON.parse(JSON.stringify(original));
    let maxArr = JSON.parse(JSON.stringify(arr));
    let minArr = JSON.parse(JSON.stringify(arr));
    minArr.sort(
      (first, secend) =>
        first[Object.keys(first)[0]] - secend[Object.keys(secend)[0]]
    );
    console.log(minArr);
    maxArr.sort(
      (first, secend) =>
        -first[Object.keys(first)[0]] + secend[Object.keys(secend)[0]]
    );

    let orderPosition = "beforeend";
    createBodyTable(arr, table);

    //range table
    let numberString = document.querySelector(".string-image");
    numberString.addEventListener("click", createSortBodt);
    let counterF = 1;
    function createSortBodt() {
      counterF += 1;
      console.log(counterF);

      if (counterF % 2 == 0) {
        createBodyTableS(maxArr, table);
        //console.log(counterF);
      } else if (counterF % 2 !== 0) {
        createBodyTableS(minArr, table);
        // console.log(counterF);
      }
    }
  }
  //creat table for range
  function createBodyTableS(arr, table) {
    let arrDele = [];

    for (let i = 1; i < table.childNodes.length; i++) {
      table.childNodes[i].classList.add("no-exist");
      arrDele.push(table.childNodes[i]);
    }
    //whyyyyyyy??????
    for (let qwv of arrDele) {
      qwv.remove();
    }

    for (let i in arr) {
      let tr = document.createElement("tr");
      let category = Object.keys(arr[i])[0];
      let value = arr[i][category];

      if (value) {
        tr.classList.add("exist-tr");
        tr.classList.add("fack");
        tr.insertAdjacentHTML(
          "beforeend",
          `<td class="exist">1F</td><td class="exist">${category}</td><td class="exist">${value}</td><td class="percent-tabl exist">${getPercent(
            value
          )}</td>`
        );
      }

      table.appendChild(tr);
    }
  }
  //create new table
  function createBodyTable(arr, table) {
    table.innerHTML = "";
    let num = 0;
    let trMain = document.createElement("tr");
    trMain.insertAdjacentHTML(
      "beforeend",
      `<td class="string-image">num</td><td>category</td><td>valye</td><td class="percent-tabl">Percent</td>`
    );
    table.appendChild(trMain);
    for (let i in arr) {
      num = num + 1;
      let tr = document.createElement("tr");
      let category = Object.keys(arr[i])[0];
      let value = arr[i][category];

      if (value) {
        tr.classList.add("exist-tr");
        tr.insertAdjacentHTML(
          "beforeend",
          `<td class="exist">${[
            num,
          ]}</td><td class="exist">${category}</td><td class="exist">${value}</td><td class="percent-tabl exist">${getPercent(
            value
          )}</td>`
        );
      }

      table.insertAdjacentElement(`beforeend`, tr);
    }
  }

  function getPercent(arr) {
    let result = ((arr / sumgetTable) * 100).toFixed(1);
    result = result + `%`;
    return result;
  }

  resultContent.appendChild(table);
}
//create table for balance
function createBalanse(debit, credit, resultContent) {
  resultContent.innerHTML = "";
  let total = debit - credit;
  let div = document.createElement("div");
  div.classList.add("balance-info");
  div.insertAdjacentHTML(
    "afterbegin",
    `<div class="debit-line"><span>debit total</span><span>${debit}<span></div>
<div class="credit-line"><span> credit total</span><span>${credit}</span></div>
<div class="balance-line"><span>balance</span><span class="balanse-total"> ${
      total || 0
    }</span></div>`
  );
  //save button
  let divForsaveButton = document.createElement("div");
  divForsaveButton.classList.add("save-result");
  resultContent.appendChild(divForsaveButton);
  divForsaveButton.insertAdjacentHTML(
    "beforeEnd",
    `<button class="save-result save-result-button">save result</button>`
  );

  resultContent.appendChild(div);

  if (total > 0) {
    document.querySelector(".balance-line").style.backgroundColor = "#46d44b";
  } else
    document.querySelector(".balance-line").style.backgroundColor = "#a81616";
}

function createBalanseForSaves(debit, credit, resultContent, key) {
  let total = debit - credit;
  let div = document.createElement("div");
  div.classList.add("balance-info");
  div.insertAdjacentHTML(
    "afterbegin",
    `<div class="debit-line"><span class="${key}">debit total</span><span>${debit}<span></div>
<div class="credit-line"><span> credit total</span><span>${credit}</span></div>
<div class="balance-line"><span>balance</span><span class="balanse-total"> ${
      total || 0
    }</span></div>`
  );
  //save button
  let divForsaveButton = document.createElement("div");
  divForsaveButton.classList.add("delete-result");
  div.appendChild(divForsaveButton);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";

  divForsaveButton.appendChild(deleteButton);

  resultContent.appendChild(div);

  deleteButton.addEventListener("click", (e) => {
    //deleteButton.parentElement.parentElement.remove();
    console.log(
      deleteButton.parentElement.parentElement.children[0].children[0].className
    );
    let IdName =
      deleteButton.parentElement.parentElement.children[0].children[0]
        .className;
    localStorage.removeItem([IdName]);
    deleteButton.parentElement.parentElement.remove();
  });

  if (total > 0) {
    document.querySelector(".balance-line").style.backgroundColor = "#46d44b";
  } else
    document.querySelector(".balance-line").style.backgroundColor = "#a81616";
}

let keyArr = [];
for (let i in localStorage) {
  keyArr.push(i);
}
for (let r = 0; r < keyArr.length - 6; r++) {
  if (keyArr[r][0] === "I") {
    let key = keyArr[r];
    console.log(key);
    let infoFromLS = JSON.parse(localStorage.getItem([key]));
    console.log(infoFromLS);
    createSaveBalanse(infoFromLS, key);
  }
}

function createSaveBalanse(arr, keyDelete) {
  let debit = arr[0];
  let credit = arr[1];
  let balance = debit - credit;
  createBalanseForSaves(debit, credit, savesContainer, keyDelete);
}

//button for interect with saves

let ButtonForInterect = document.querySelector(".show-button");
let countForInterect = 1;
ButtonForInterect.addEventListener("click", (e) => {
  if (savesContainer.children.length > 0) {
    countForInterect += 1;
    if (countForInterect % 2 == 0) {
      ButtonForInterect.innerHTML = "Hide saves";
      savesContainer.classList.toggle("saves-container-interect");
    } else if (countForInterect % 2 !== 0) {
      ButtonForInterect.innerHTML = "Show saves";
      savesContainer.classList.toggle("saves-container-interect");
    }
  } else alert("container of savings is empty!");
});
