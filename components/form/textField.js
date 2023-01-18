const TextField = ({label, error, ...props}) => {
    
  return (
    <>
      <label htmlFor={props.name} className='font-medium'>{label}</label>
      <input {...props} className={`border-2 rounded-md h-10 ${error ? 'border-red' : null}`}/>
      {error ? (<span className="text-red">{error} </span>) : null}
    </>
  )
}

export default TextField;