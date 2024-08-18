export function validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
  
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
  
    const calcDigit = (base: string, factor: number) => {
      const total = base.split('').reduce((sum, num, idx) => sum + parseInt(num) * (factor - idx), 0);
      const remainder = (total * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };
  
    const base = cpf.slice(0, 9);
    const digit1 = calcDigit(base, 10);
    const digit2 = calcDigit(base + digit1, 11);
  
    return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
  }
  
  export function validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/\D/g, '');
  
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }
  
    const calcDigit = (base: string, factors: number[]) => {
      const total = base.split('').reduce((sum, num, idx) => sum + parseInt(num) * factors[idx], 0);
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };
  
    const base = cnpj.slice(0, 12);
    const factors1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const factors2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
    const digit1 = calcDigit(base, factors1);
    const digit2 = calcDigit(base + digit1, factors2);
  
    return digit1 === parseInt(cnpj[12]) && digit2 === parseInt(cnpj[13]);
  }
  