import EmergencyScreen from '../screens/Emergency';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';

export default function Emergency() {
  return <EmergencyScreen footerInset={TAB_BAR_OVERLAY_HEIGHT} />;
}
