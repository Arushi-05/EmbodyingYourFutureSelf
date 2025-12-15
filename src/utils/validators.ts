export function validateEmail(email: string): string | null {
    if (!email) return "Email is required";
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
  
    return null;
  }
  
  export function validatePassword(password: string): string | null {
    if (!password) return "Password is required";
    if (password.length < 4) return "Password must be at least 4 characters long";
  
    // optional: add stronger requirements
    // if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    // if (!/[0-9]/.test(password)) return "Password must contain a number";
  
    return null;
  }
  
  export function validateName(name: string): string | null {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters long";
  
    return null;
  }
  
  export function validateSignup(data: { email: string; password: string; name: string }) {
    const errors: string[] = [];
  
    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);
  
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(passwordError);
  
    const nameError = validateName(data.name);
    if (nameError) errors.push(nameError);
  
    return errors;
  }
  