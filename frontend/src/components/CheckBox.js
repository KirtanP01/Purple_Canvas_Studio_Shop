import { useState } from "react";

const Checkbox = ({label, checked}) => {
    const defaultChecked = checked ? checked : false;
    const [isChecked, setIsChecked] = useState(false);
    const handleChange = () => { 
        setIsChecked(!isChecked); 
      }; 
    return (
      <div className="checkbox-wrapper" id="schoolPickUp">
        <label>
          <input 
            type="checkbox"
            checked={isChecked} 
            //onChange={() => setIsChecked((prev) => !prev)} 
            onChange={() => handleChange()} 
          />
          <span>{label}</span>
        </label>
        {<p>{isChecked ? "Selected" : "Unchecked"}</p>}
      </div>
    );
  };
  export default Checkbox;