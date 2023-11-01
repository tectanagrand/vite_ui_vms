import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { useEffect, useRef, useState } from 'react';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Undo,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { styled, lighten, darken } from '@mui/material/styles';

function EditToolbar(props) {
  const { setVen_bank, setRowModesModel, idParent, isallow } = props;
  const handleClick = () => {
    const id = randomId();
    setVen_bank((oldRows) => [
      ...oldRows,
      {
        id: id,
        bank_id: '',
        bank_acc: '',
        acc_hold: '',
        acc_name: '',
        isNew: true,
        method: 'insert',
        isDb: false,
        ven_id: idParent,
      },
    ]);
    setRowModesModel((oldModel) => ({ ...oldModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'bank_id' } }));
  };
  return (
    isallow && (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add
        </Button>
      </GridToolbarContainer>
    )
  );
}

export default function VenBankTable({ onChildDataChange, initData, idParent, banks, isallow }) {
  let covtData = [];
  const [ven_bank, setVen_bank] = useState([]);
  const banksData = banks?.map((item) => ({ value: item.bank_id, label: item.bank_name }));
  const bank_data = useRef();
  bank_data.current = banksData;

  const DataGridBank = styled(DataGrid, { shouldForwardProp: (prop) => prop !== 'sx' })(() => ({
    '& .row-idle': {
      backgroundColor: '#fff',
    },
    '& .row-delete': {
      backgroundColor: '#fc8b72',
      '&:hover': {
        backgroundColor: lighten('#fc8b72', 0.2),
      },
      '&.Mui-selected': {
        backgroundColor: darken('#fc8b72', 0.2),
        '&:hover': {
          backgroundColor: lighten('#fc8b72', 0.2),
        },
      },
    },
  }));

  useEffect(() => {
    if (Object.keys(initData).length != 0) {
      initData.map((item) => {
        covtData.push({ ...item, isDb: true, isNew: false, method: '' });
      });
      setVen_bank(covtData);
    }
  }, [initData]);

  useEffect(() => {
    const sendDataParent = (ven_bank) => {
      let items = [];
      ven_bank.map((item) => {
        if (item.method !== '') {
          let temp = { ...item, bankv_id: item.id };
          delete temp.isDb;
          delete temp.isNew;
          delete temp.id;
          items.push(temp);
        }
      });
      onChildDataChange(items);
    };
    sendDataParent(ven_bank);
  }, [ven_bank]);

  const [rowModesModel, setRowModesModel] = useState({});
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleSaveClick = (row) => () => {
    setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.View } });
  };
  const handleDeleteClick = (id) => () => {
    let prevData = [];
    ven_bank.map((item) => {
      if (item.id === id) {
        if (item.isDb == true) {
          prevData.push({ ...item, method: 'delete' });
        }
      } else {
        prevData.push(item);
      }
    });
    setVen_bank(prevData);
    // sendDataParent(prevData);
  };
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });
    const editedRow = ven_bank.find((row) => row.id === id);
    if (editedRow.isNew) {
      setVen_bank(ven_bank.filter((row) => row.id != id));
    }
  };
  const handleUndoClick =
    ({ id }) =>
    () => {
      let pushData = [];
      ven_bank.map((item) => {
        if (item.id === id) {
          pushData.push({ ...item, method: '' });
        } else {
          pushData.push(item);
        }
      });
      setVen_bank(pushData);
    };
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    let prevData = [];
    ven_bank.map((row) => {
      if (row.id === newRow.id) {
        if (row.isDb === true) {
          prevData.push({ ...updatedRow, method: 'update' });
        } else {
          prevData.push(updatedRow);
        }
      } else {
        prevData.push(row);
      }
    });
    setVen_bank(prevData);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
    // sendDataParent(ven_bank);
  };
  const columns = [
    {
      field: 'bank_id',
      type: 'singleSelect',
      headerName: 'Bank Name',
      valueOptions: bank_data.current,
      editable: true,
      width: 300,
    },
    { field: 'bank_acc', type: 'string', headerName: 'Bank Account', width: 200, editable: true },
    { field: 'acc_hold', type: 'string', headerName: 'Account Holder', width: 200, editable: true },
    { field: 'acc_name', type: 'string', headerName: 'Account Name', width: 200, editable: true },
    {
      field: 'action',
      type: 'actions',
      headerName: 'Action',
      width: 100,
      cellClassName: 'actions',
      getActions: (row) => {
        let id = row.id;
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isallow) {
          if (isInEditMode) {
            return [
              <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(row)} />,
              <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
            ];
          } else {
            if (row.row.method == 'delete') {
              return [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(row)} />,
                <GridActionsCellItem icon={<Undo />} label="Undo" onClick={handleUndoClick(row)} />,
              ];
            }
            return [
              <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(row)} />,
              <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} />,
            ];
          }
        } else {
          return [];
        }
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={ven_bank}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setVen_bank, setRowModesModel, idParent, isallow },
        }}
        getRowClassName={(params) => {
          if (params.row.method == 'delete') {
            return 'row-delete';
          } else {
            return 'row-idle';
          }
        }}
        autoHeight
      />
    </>
  );
}
