import { View } from "react-native";
import { MediaSlot } from "../../components/ui/MediaSlot";
import { ProfileMedia } from "../../context/CreateProfileContext";

const MAX = 4;

type Props = {
  media: ProfileMedia[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onPreview: (index: number) => void;
};

export function MediaGrid({ media, onAdd, onRemove, onPreview }: Props) {
  const slots: (ProfileMedia | undefined)[] = [
    ...media,
    ...Array(MAX - media.length).fill(undefined),
  ];

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20 }}>
      {slots.map((item, index) => (
        <MediaSlot
          key={index}
          media={item}
          onAdd={onAdd}
          onRemove={() => onRemove(index)}
          onPreview={() => onPreview(index)}
        />
      ))}
    </View>
  );
}
