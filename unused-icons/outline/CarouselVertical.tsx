import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCarouselVertical = (props: SvgProps) => (
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
    <Path d="M19 8v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1" />
    <Path d="M7 22v-1a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v1" />
    <Path d="M17 2v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1" />
  </Svg>
);
export default SvgCarouselVertical;
