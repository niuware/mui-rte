import React, { FunctionComponent, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MovieIcon from '@mui/icons-material/Movie';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import { Box } from '@mui/material';

export type TAlignment = 'left' | 'center' | 'right';

export type TMediaType = 'image' | 'video';

export type TUrlData = {
  url?: string;
  width?: number;
  height?: number;
  alignment?: TAlignment;
  type?: TMediaType;
};

interface IUrlPopoverStateProps {
  anchor?: HTMLElement;
  data?: TUrlData;
  isMedia?: boolean;
  onConfirm: (isMedia?: boolean, ...args: any) => void;
}

const UrlPopover: FunctionComponent<IUrlPopoverStateProps> = (props) => {
  const { data, anchor, isMedia, onConfirm } = props;
  const [dataState, setDataState] = useState<TUrlData>(
    data || {
      url: undefined,
      width: undefined,
      height: undefined,
      alignment: undefined,
      type: undefined,
    },
  );

  const onSizeChange = (value: any, prop: 'width' | 'height') => {
    if (value === '') {
      setDataState({ ...dataState, [prop]: undefined });
      return;
    }
    const intValue = parseInt(value, 10);
    if (Number.isNaN(intValue)) {
      return;
    }
    setDataState({ ...dataState, [prop]: intValue });
  };

  return (
    <Popover
      open={anchor !== undefined}
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box
        sx={(theme) => ({
          padding: theme.spacing(2, 2, 2, 2),
          maxWidth: 250,
        })}
      >
        <Grid container spacing={1}>
          <Grid container item xs spacing={1}>
            <Grid item xs={12}>
              <TextField
                sx={{ width: '100%' }}
                onChange={(event) => setDataState({ ...dataState, url: event.target.value })}
                label="URL"
                defaultValue={data && data.url}
                autoFocus
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {isMedia ? (
              <>
                <Grid item xs={12}>
                  <ButtonGroup fullWidth>
                    <Button
                      color={!dataState.type || dataState.type === 'image' ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => setDataState({ ...dataState, type: 'image' })}
                    >
                      <InsertPhotoIcon />
                    </Button>
                    <Button
                      color={dataState.type === 'video' ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => setDataState({ ...dataState, type: 'video' })}
                    >
                      <MovieIcon />
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    onChange={(event) => onSizeChange(event.target.value, 'width')}
                    value={dataState.width || ''}
                    label="Width"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    onChange={(event) => onSizeChange(event.target.value, 'height')}
                    value={dataState.height || ''}
                    label="Height"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ButtonGroup fullWidth>
                    <Button
                      color={dataState.alignment === 'left' ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => setDataState({ ...dataState, alignment: 'left' })}
                    >
                      <FormatAlignLeft />
                    </Button>
                    <Button
                      color={dataState.alignment === 'center' ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => setDataState({ ...dataState, alignment: 'center' })}
                    >
                      <FormatAlignCenter />
                    </Button>
                    <Button
                      color={dataState.alignment === 'right' ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => setDataState({ ...dataState, alignment: 'right' })}
                    >
                      <FormatAlignRight />
                    </Button>
                  </ButtonGroup>
                </Grid>
              </>
            ) : null}
          </Grid>
          <Grid container item xs={12} direction="row" justifyContent="flex-end">
            {data && data.url ? (
              <Button onClick={() => onConfirm(isMedia, '')}>
                <DeleteIcon />
              </Button>
            ) : null}
            <Button
              onClick={() =>
                onConfirm(
                  isMedia,
                  dataState.url,
                  dataState.width,
                  dataState.height,
                  dataState.alignment,
                  dataState.type,
                )
              }
            >
              <CheckIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
};

export default UrlPopover;
