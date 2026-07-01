import './App.css'
import First, { First1,First2,StateComponent,ConditionalRendering } from './Class 1/First'
import Second, { FormHandlingManual, FormHandlingPackage, UseEffect } from './Class 2/Second';
function App() {

  let name="Ayush";
  let city="Noida";

  let skills=["React","Node","Express","Mongodb"];
  return (
    <>
      {/* <First />
      <First1 />
      <First2/> */}
      {/* <StateComponent/> */}
      {/* <ConditionalRendering/> */}
      
      {/* The way we give an attribute */}
      {/* <Second name={name} city={city} skills={skills}/> */}
      {/* <UseEffect/> */}
      {/* <FormHandlingManual/> */}
      <FormHandlingPackage/>
    </>
  )
}

export default App
