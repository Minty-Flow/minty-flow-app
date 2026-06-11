import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShoppingCartDiscount = (props: SvgProps) => (
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
    <Path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M12.5 17h-6.5v-14h-2" />
    <Path d="M6 5l14 1l-.859 6.011m-6.141 .989h-7" />
    <Path d="M16 21l5 -5" />
    <Path d="M21 21v.01" />
    <Path d="M16 16v.01" />
  </Svg>
);
export default SvgShoppingCartDiscount;
