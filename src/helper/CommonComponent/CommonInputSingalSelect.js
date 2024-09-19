import { memo } from "react";
import { Dropdown } from "primereact/dropdown";
import { useFormContext } from "react-hook-form";

const CommonInputSingalSelect = props => {
  const { title='', id='', name='', placeholder='', isRequired=false, options=[] } = props;

  const methods = useFormContext();
  const { setValue, watch } = methods;
  
  return (
    <div className="form_input">
      <label className="w-6rem">
        {title} {isRequired && <span className="fs-6" style={{ color: "red"}}>*</span>}
      </label>
      <div className="mt-2 mb-3">
        <Dropdown
            filter
            id={id}
            name={name}
            options={options}
            value={watch(name)}
            placeholder={placeholder}
            className="input_select"
            onChange={(e) => setValue(name, e.value)}
        />
        {methods?.formState?.errors[name] &&
          <p className="text-red-500 text-xs mt-1">
            {methods?.formState?.errors[name]?.message}
          </p>}
      </div>
    </div>
  );
};

export default memo(CommonInputSingalSelect);
