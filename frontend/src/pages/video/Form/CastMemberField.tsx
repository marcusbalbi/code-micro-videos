import AsyncAutocomplete, {
  AsyncAutoCompleteComponent,
} from "../../../components/AsyncAutocomplete";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  Typography,
} from "@material-ui/core";
import React, {
  MutableRefObject,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { CastMember } from "../../../util/dto";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import httpCastMember from "../../../util/http/http-cast-member";
import useCollectionManager from "../../../hooks/useCollectionManager";
import useHttpHandler from "../../../hooks/useHttpHandler";

interface CastMemberFieldProps extends RefAttributes<CastMemberFieldProps> {
  castMembers: CastMember[] | undefined;
  setCastMembers: (castMembers) => void;
  error: any;
  disabled?: boolean;
  formControlProps?: FormControlProps;
}

export interface CastMemberFieldComponent {
  clear: () => void;
}

const CastMemberField = React.forwardRef<
  CastMemberFieldComponent,
  CastMemberFieldProps
>((props, ref) => {
  const { castMembers, setCastMembers, disabled, error } = props;
  const autocompleteRef = useRef() as MutableRefObject<AsyncAutoCompleteComponent>;
  const { addItem, removeItem } = useCollectionManager(
    castMembers || [],
    setCastMembers
  );
  const autoCompleteHttp = useHttpHandler();
  const fetchOptions = useCallback(
    (searchText) => {
      if (!castMembers) {
        return Promise.resolve();
      }
      return autoCompleteHttp(
        httpCastMember.list({
          queryParams: {
            search: searchText,
            all: "",
          },
        })
      )
        .then((data) => {
          return data.data;
        })
        .catch((error) => console.log(error));
    },
    [autoCompleteHttp, castMembers]
  );
  useImperativeHandle(ref, () => {
    return {
      clear: () => {
        autocompleteRef.current.clear();
      },
    };
  });
  return (
    <>
      <AsyncAutocomplete
        fetchOptions={fetchOptions}
        AutoCompleteProps={{
          ref: autocompleteRef,
          // autoSelect: true,
          freeSolo: true,
          clearOnEscape: true,
          disabled,
          getOptionLabel: (item) => item.name,
          getOptionSelected: (item) => item.id,
          onChange: (event, value) => {
            addItem(value);
          },
        }}
        TextFieldProps={{
          label: "Membros de Elenco",
          error: error !== undefined,
        }}
      />
      <FormControl
        margin="normal"
        fullWidth
        disabled={disabled === true}
        error={error !== undefined}
        {...props.formControlProps}
      >
        <GridSelected>
          {castMembers &&
            castMembers.map((castMember, key) => {
              return (
                <GridSelectedItem
                  item
                  key={key}
                  xs={6}
                  onDelete={() => {
                    removeItem(castMember);
                  }}
                >
                  <Typography noWrap={true}>{castMember.name}</Typography>
                </GridSelectedItem>
              );
            })}
        </GridSelected>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
});

export default CastMemberField;
