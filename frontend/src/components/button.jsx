export default function Input1({
  classNamed,
  classNamel,
  classNamei,
  text,
  id,
  value,
  type,
  placeholder,
  onChange,
}) {
  return (
    <div className={classNamed}>
      <label htmlFor={id} className={classNamel}>
        {text}
      </label>
      <input
        className={classNamei}
        id={id}
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      />
    </div>
  );
}
