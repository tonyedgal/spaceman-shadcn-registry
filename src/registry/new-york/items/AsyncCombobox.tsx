import {
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AsyncComboBoxProps<T> {
  placeholder: string;
  selected?: T;
  onChange: (data: T) => void;
  renderItem: (item: T, btn?: boolean) => ReactNode;
  getItemKey: (item: T) => string;
  onSearch: (query: string) => void;
  query: string;
  data: T[];
  isLoading: boolean;
  isError: boolean;
}

const AsyncComboBox = forwardRef(function AsyncComboBox<T>(
  {
    placeholder,
    selected,
    onChange,
    renderItem,
    getItemKey,
    onSearch,
    query,
    data,
    isLoading,
    isError,
  }: AsyncComboBoxProps<T>,
  ref: React.Ref<{ clear: () => void }>
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T | undefined>(selected);

  const handleSetActive = useCallback(
    (item: T) => {
      setValue(item);
      setOpen(false);
      onChange(item);
    },
    [onChange]
  );

  const displayName = value
    ? renderItem(value)
    : `${placeholder ? `Select ${placeholder}...` : "Select ..."}`;

  useImperativeHandle(ref, () => ({
    clear: () => setValue(undefined),
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {displayName}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder}`}
            onValueChange={onSearch}
            className="h-9"
          />
          <ScrollArea className="max-h-72 w-[200px]">
            <CommandGroup>
              {isLoading && <div className="p-4 text-sm">Searching...</div>}
              {!isError && !isLoading && !data?.length && query.length > 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {isError && (
                <div className="p-4 text-sm">Something went wrong</div>
              )}

              {data.map((item) => (
                <CommandItem
                  key={getItemKey(item)}
                  value={getItemKey(item)}
                  onSelect={() => handleSetActive(item)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && getItemKey(value) === getItemKey(item)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {renderItem(item, true)}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

AsyncComboBox.displayName = "AsyncComboBox";

export default AsyncComboBox;
