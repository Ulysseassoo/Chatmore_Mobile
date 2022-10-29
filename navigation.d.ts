
import { RootStackParamList } from './src/Interface/Navigator';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}