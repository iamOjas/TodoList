import React, {
  Component,
  useEffect,
  useState
} from "react";
import TodolistContract from "./contracts/Todolist.json";
import getWeb3 from "./getWeb3";

import "./App.css";

var App = () => {
  const [taskCount, setTaskCount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [Contract, setContract] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState("");
  const [trigger, toggle] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = TodolistContract.networks[networkId];
        const instance = new web3.eth.Contract(
          TodolistContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        // this.setState({ web3, accounts, contract: instance }, this.runExample);
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, [])

  useEffect(() => {
    const init = async () => {
      // Stores a given value, 'Hello' by default.

      // await Contract.methods.createTask("Hello").send({from: accounts[0]})
      // await Contract.methods.createTask("Ojas").send({from: accounts[0]})

      // Get the value from the contract to prove it worked.
      setTasks([]);
      const taskcount = await Contract.methods.listCounter().call();
      for (var i = 1; i <= taskcount; i++) {
        let Tasks = await Contract.methods.tasks(i).call();
        setTasks(t => { return [...t, Tasks] })

      }
      // // Update state with the result.

      setTaskCount(taskcount)
    }
    if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof Contract !== 'undefined') {
      init();
    }

  }, [web3, accounts, Contract, trigger])

  if (typeof web3 === 'undefined') {
    return <div> Loading Web3, accounts, and contract... </div>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await Contract.methods.createTask(value).send({ from: accounts[0] })
    toggle(!trigger)
  }
  
  async function handleCheckBox(input){
    await Contract.methods.taskCompleted(input.target.name).send({ from: accounts[0] })
    
  }

  return (
    <div className="App" >
      <h1>TODOLIST</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => { setValue(e.target.value) }}
          placeholder = "Add task..."
          required
        />
        <button type="submit">Submit</button>
      </form>
      <div> The stored value is: {
        taskCount}
        <ul>
          {tasks.map((task, key) => { 
            return (
            <li key={key}> 
            <label>
              <input 
              type="checkbox" 
              name={task.id} 
              defaultChecked = {task.completed}
              onChange = {handleCheckBox}
              /> 
              {task.content}
              </label>
              </li> 
              )
              })}
        </ul>
      </div>
    </div>
  )

}

export default App;