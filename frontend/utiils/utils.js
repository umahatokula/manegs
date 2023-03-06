export function calculateAge(dob) {
    let today = new Date();
    let birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const increaseGasLimit = (estimatedGasLimit) => {
    return estimatedGasLimit.mul(130).div(100) // increase by 30%
}
  