import { memo } from "react";
import { InputText } from "primereact/inputtext";
import { Controller, useFormContext } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from 'primereact/calendar';

const CommonInputText = props => {
  const { title = '', id = '', type = "text", name = '', placeholder = '', minDate, isRequired = false, className = '', options = [], disabled, fieldOnChange } = props;

  const methods = useFormContext();
  const { control, register, setValue, watch } = methods;

  return (
    <div className={`form_input ${className}`}>
      {title && (
        <div className="w-6rem">
          {title} {isRequired && <span className="fs-6" style={{ color: "red" }}>*</span>}
        </div>
      )}
      <div className="mt-3 mb-3">
        {type === 'date' ? (
          <Controller
            name={name}
            control={control}
            render={
              (
                { field: { onChange, value, ref }, fieldState: { error } },
              ) => (
                <Calendar
                  id={id}
                  name={name}
                  minDate={minDate && minDate}
                  value={value ? new Date(value) : ''}
                  placeholder={`Enter ${title}`}
                  showIcon
                  dateFormat="dd-mm-yy"
                  // maxDate={new Date()}
                  readOnlyInput
                  onChange={(e) => setValue(name, e.target.value, { shouldValidate: true })}
                  showButtonBar
                  className="date_wrapper"
                />
              )
            }
          />
        ) : type === 'time' ? (
          <Controller
            name={name}
            control={control}
            render={
              (
                { field: { onChange, value, ref }, fieldState: { error } },
              ) => (
                <Calendar
                  id={id}
                  name={name}
                  value={value}
                  placeholder={`Enter ${title}`}
                  className="input_select"
                  timeOnly
                  timeFormat="HH:mm"
                  onChange={(e) => {
                    setValue(name, e.value, { shouldValidate: true });
                    console.log('e.value', e.value)
                  }}

                // {...register(time, { required: true })}
                />
              )
            }
          />

        ) : type === 'number' ? (
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
                  placeholder={`Enter ${title || placeholder}`}
                  useGrouping={false}
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  disabled={disabled}
                  className='input_number'
                  onChange={fieldOnChange ? fieldOnChange : (e) => setValue(name, e.value, { shouldValidate: true })}
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
                  // onChange={(e) => setValue(name, e.value, { shouldValidate: true })}
                  onChange={fieldOnChange ? fieldOnChange : (e) => setValue(name, e.value, { shouldValidate: true })}
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
                  className='input_wrap'
                  onChange={fieldOnChange ? fieldOnChange : (e) => setValue(name, e?.target?.value, { shouldValidate: true })}
                // {...register(name, { required: true })}
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
