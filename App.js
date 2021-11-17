import React, {useState,useEffect} from "react";
import './App.css';
import ExpenseList from "./components/ExpenseList";
import Alert  from "./components/Alert";
import ExpenseForm from "./components/ExpenseForm";
import *as uuid from "uuid";  





const initialExprenses = localStorage.getItem("expenses") 
  ? JSON.parse(localStorage.getItem('expenses')):[];


function App() {
/* state values */ 
const [expenses , setExpenses] = useState(initialExprenses);
const [charge,setCharge] = useState("");
const [amount,setAmount] = useState("");
const [alert , setAlert] = useState({show:false});
const [edit, setedit]=useState(false);
const [id,setid]=useState(0);

useEffect(()=>{

  localStorage.setItem("expenses",JSON.stringify(expenses));
},[expenses])



/* functionality  */

const handleCharge = e => {
  setCharge(e.target.value);
}
const handleAmount = e => {
 
  setAmount(e.target.value);
}
const handleAlert = ( { type,text}) => {
  setAlert({show: true , type ,text });
  setTimeout(()=>{
    setAlert({show: false});
  }, 3000);

}

const handleSubmit = e=>{
  e.preventDefault();

  if (charge!== " " && amount > 0){

    if (edit){
      let tempexpenses = expenses.map( e => {
          return e.id=== id ? {...e,charge,amount} : e;
      });
      setExpenses(tempexpenses);
      setedit(false);
      handleAlert({type: "success", text : "depense modifier "});

    }else {
      const expense = {id:uuid.v4(), charge,amount}
      setExpenses([...expenses,expense]);
      handleAlert({type: "success", text : "depense ajouter "});
    }
  
    setAmount("");
    setCharge("");

  }else{
    // handler alert 
    handleAlert({
      type:"danger",
      text :`la charge ne peut pas être une valeur vide et la valeur du montant doit être supérieure à zéro`
    })
  }
}

// delet items 


const clearItems = ()=>{
 
  setExpenses([])
  handleAlert({type:"danger", text : ` touts les depenses sont supprimer `});
}

const handlDeletItem =(id)=>{


  let tempexpenses = expenses.filter(item => item.id !== id);

  
  setExpenses(tempexpenses);
  let itemdelete = expenses.filter(e=> e.id === id);
  
  handleAlert({type:"danger", text : `${itemdelete[0].charge} supprimer  `});
};
const handlEdititem =(id)=>{

  let expense = expenses.find(e=> e.id=== id);
  let {charge,amount} = expense;
  setAmount(amount);
  setCharge(charge);
  setid(id);
  setedit(true);
}
  return (
    <div >

      { alert.show && <Alert type={ alert.type} text = { alert.text }/>}
      <Alert/>
      <h1> calculateur de budget </h1>
      <main className="App">
        <ExpenseForm charge = {charge} amount={amount} handleAmount={handleAmount} handleCharge={ handleCharge} handleSubmit={handleSubmit} edit={edit} id={id}/>
        <ExpenseList expenses={expenses}
        handlDeletItem={handlDeletItem}
        handlEdititem={handlEdititem}
        clearItems={clearItems}/>
      </main>
      <h1> dépenses totales : {" "}
      <span className="total">
        ${
          expenses.reduce((prev,curr) => {
            return prev += (parseInt (curr.amount));
          },0)}
        </span> 
      </h1>
    
    </div>
  );
}

export default App;
