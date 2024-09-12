import { memo } from "react";
import { InputText } from "primereact/inputtext";
import { useFormContext } from "react-hook-form";

const CommonInputText = props => {
  const { title='', id='', type="text", name='', placeholder='', isRequired=false, className='input_wrap' } = props;

  const methods = useFormContext();
  const { register } = methods;

  return (
    <div className="form_input">
      <label className="w-6rem">
        {title} {isRequired && <span className="fs-6" style={{ color: "red"}}>*</span>}
      </label>
      <div className="mt-2 mb-3">
        <InputText
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          className={className}
          {...register(name, { required: true })}
        />
        {methods?.formState?.errors?.[name] &&
          <p className="text-red-500 text-xs mt-1">
            {methods?.formState?.errors[name]?.message}
          </p>}
      </div>
    </div>
  );
};

export default memo(CommonInputText);
