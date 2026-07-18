import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgRugby = (props: SvgProps) => (
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
    <Path d="M14 15h-4v6h4v-6" />
    <Path d="M12 15v-4" />
    <Path d="M8 21h8" />
    <Path d="M19 3v8h-14v-8" />
  </Svg>
);
export default SvgRugby;
