const InputNumber = ({ label, name, value, onChange, placeholder = "" }) => {
  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      onChange(val);
    }
  };

  const handleKeyDown = (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-3 border rounded"
      />
    </div>
  );
};

export default InputNumber;