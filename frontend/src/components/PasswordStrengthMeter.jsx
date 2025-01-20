import React from 'react'

const PassowrdCriteria = ({password}) => {
    const criteria = [
		{ label: "At least 6 characters", met: password.length >= 6 },
		{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
		{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
		{ label: "Contains a number", met: /\d/.test(password) },
		{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	];

    
}


const PasswordStrengthMeter = () => {
  return (
    <div>
      
    </div>
  )
}

export default PasswordStrengthMeter
