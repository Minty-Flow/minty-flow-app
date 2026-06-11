import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTipJarEuro = (props: SvgProps) => (
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
    <Path d="M17 4v1.882c0 .685 .387 1.312 1 1.618s1 .933 1 1.618v8.882a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3v-8.882c0 -.685 .387 -1.312 1 -1.618s1 -.933 1 -1.618v-1.882" />
    <Path d="M6 4h12l-12 0" />
    <Path d="M12 13h-3" />
    <Path d="M14 10.172a3 3 0 1 0 0 5.656" />
  </Svg>
);
export default SvgTipJarEuro;
