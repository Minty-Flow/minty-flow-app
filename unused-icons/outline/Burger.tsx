import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBurger = (props: SvgProps) => (
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
    <Path d="M4 15h16a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4" />
    <Path d="M12 4c3.783 0 6.953 2.133 7.786 5h-15.572c.833 -2.867 4.003 -5 7.786 -5" />
    <Path d="M5 12h14" />
  </Svg>
);
export default SvgBurger;
