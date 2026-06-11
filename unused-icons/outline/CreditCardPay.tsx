import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCreditCardPay = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
    <Path d="M3 10h18" />
    <Path d="M16 19h6" />
    <Path d="M19 16l3 3l-3 3" />
    <Path d="M7.005 15h.005" />
    <Path d="M11 15h2" />
  </Svg>
);
export default SvgCreditCardPay;
