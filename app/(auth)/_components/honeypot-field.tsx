import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const HoneypotField = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="extraInfo"
      render={({ field }) => (
        <FormItem hidden>
          <FormLabel>Extra Info</FormLabel>
          <FormControl>
            <Input
              {...field}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default HoneypotField;
