import { memo } from "react";
import { InputText } from "primereact/inputtext";
import { Controller, useFormContext } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

const CommonInputText = props => {
  const { title='', id='', type="text", name='', placeholder='', isRequired=false, className='input_wrap', options=[] } = props;

  const methods = useFormContext();
  const { control, register, setValue, watch } = methods;

  return (
    <div className="form_input">
      <label className="w-6rem">
        {title} {isRequired && <span className="fs-6" style={{ color: "red"}}>*</span>}
      </label>
      <div className="mt-2 mb-3">
        {type === 'number' ? (
          <Controller
            name={name}
            control={control}
            render={
              (
                { field: { onChange, value, ref }, fieldState: { error } },
              ) => (
                <InputNumber
                  id={id}
                  name={name}
                  value={value}
                  placeholder={`Enter ${title}`}
                  useGrouping={false}
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  className={className}
                  onChange={(e) => setValue(name, e.value, { shouldValidate: true })}
                />
              )
            }
          />
        ) : type === 'single_select' ? (
          <Controller
            name={name}
            control={control}
            render={
              (
                { field: { onChange, value, ref }, fieldState: { error } },
              ) => (
                <Dropdown
                  filter
                  id={id}
                  name={name}
                  options={options}
                  value={watch(name)}
                  placeholder={`Enter ${title}`}
                  className="input_select"
                  onChange={(e) => setValue(name, e.value)}
                />
              )
            }
          />
        ) : (
          <Controller
            name={name}
            control={control}
            render={
              (
                { field: { onChange, value, ref }, fieldState: { error } },
              ) => (
                <InputText
                  id={id}
                  type={type}
                  name={name}
                  value={value}
                  placeholder={`Enter ${title}`}
                  className={className}
                  {...register(name, { required: true })}
                />
              )
            }
          />
        )}
      {methods?.formState?.errors?.[name] &&
        <p className="text-red-500 text-xs mt-1">
          {methods?.formState?.errors[name]?.message}
        </p>
      }
      </div>
    </div>
  );
};

export default memo(CommonInputText);
