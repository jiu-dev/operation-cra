import { Imputation } from './imputation.interface';

export interface Cra {
  month?: number;
  year?: number;
  imputations: Imputation[];
}
