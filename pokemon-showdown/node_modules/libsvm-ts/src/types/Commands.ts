export const SVMTypes = ['C_SVC', 'NU_SVC', 'ONE_CLASS', 'EPSILON_SVR', 'NU_SVR'];

export const KernelTypes = ['LINEAR', 'POLYNOMIAL', 'RBF', 'SIGMOID', 'PRECOMPUTED'];

export interface Arguments {
  quiet?: boolean;
  type?: string;
  kernel?: string;
  degree?: number;
  gamma?: number;
  coef0?: number;
  cost?: number;
  nu?: number;
  epsilon?: number;
  cacheSize?: number;
  tolerance?: number;
  shrinking?: boolean;
  probabilityEstimates?: boolean;
  weight?: { [n: number]: number };
}
