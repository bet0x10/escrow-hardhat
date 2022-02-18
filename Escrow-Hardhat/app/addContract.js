import {ethers} from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

const provider = new ethers.providers.Web3Provider(ethereum);

export default async function addContract(id, mycontract, arbiter, beneficiary, value) {

  let postbody = JSON.stringify({"arbiter": arbiter, "beneficiary": beneficiary, "address": mycontract.address, "interface": Escrow.abi, "value": value});
  
  let res = await fetch("http://localhost:3104/add", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: postbody,
    
  });

  await res.json();
  
  runList();
}

export async function runList() {

  let res = await fetch("http://localhost:3104/list");
  let json = await res.json();
  //console.log(json);
  //alert(json);

  let id = 0;

  for(var key in json) {
    
    const buttonId = `approve-${id}`;

    let thisContract = json[key];
    console.log(thisContract);

    const container = document.getElementById("container");
    container.innerHTML += createHTML(buttonId, thisContract.arbiter, thisContract.beneficiary, thisContract.value);
    
    id++;

  }

  id = 0;
  for(var key in json) {
    
    const buttonId = `approve-${id}`;

    let thisContract = json[key];
    console.log(thisContract);

    let signer = provider.getSigner();
    let thiscontract = new ethers.Contract(thisContract.address, Escrow.abi, signer);

    thiscontract.on('Approved', () => {
      document.getElementById(buttonId).className = "complete";
      document.getElementById(buttonId).innerText = "✓ It's been approved!";
    });

    document.getElementById(buttonId).addEventListener("click", async () => {
      alert(buttonId);
      let signer = provider.getSigner();
      
      //await thisContract.mycontract.connect(signer).approve();
      
      await thiscontract.connect(signer).approve();
    });
    id++;
  }

  

}

function createHTML(buttonId, arbiter, beneficiary, value) {
  return `
    <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> ${arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> ${beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> ${value} </div>
        </li>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
  `;
}
