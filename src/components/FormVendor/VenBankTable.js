import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { useEffect, useState } from 'react';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Button } from '@mui/material';

function EditToolbar(props) {
  const { setVen_bank, setRowModesModel } = props;
  const handleClick = () => {
    const id = randomId();
    setVen_bank((oldRows) => [
      ...oldRows,
      { id: id, bank_id: '', bank_acc: '', acc_hold: '', acc_name: '', isNew: true, mode: 'insert', isDb: false },
    ]);
    setRowModesModel((oldModel) => ({ ...oldModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'bankv_id' } }));
  };
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add
      </Button>
    </GridToolbarContainer>
  );
}

export default function VenBankTable({ onChildDataChange, initData }) {
  let covtData = [];
  if (initData != null) {
    initData.map((item) => {
      covtData.push({ ...item, isDb: true, isNew: false, mode: '' });
    });
  }
  const [ven_bank, setVen_bank] = useState(covtData ? covtData : []);
  const sendDataParent = (ven_bank) => {
    let items = [];
    ven_bank.map((item) => {
      if (item.mode !== '') {
        let temp = { ...item };
        delete temp.isDb;
        delete temp.isNew;
        items.push(temp);
      }
    });
    onChildDataChange(items);
  };
  const [rowModesModel, setRowModesModel] = useState({});
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleDeleteClick = (id) => () => {
    let prevData = [];
    ven_bank.map((item) => {
      if (item.id === id) {
        if (item.isDb == true) {
          prevData.push({ ...item, mode: 'delete' });
        }
      } else {
        prevData.push(item);
      }
    });
    setVen_bank(prevData);
    sendDataParent(prevData);
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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    let prevData = [];
    ven_bank.map((row) => {
      if (row.id === newRow.id) {
        if (row.isDb === true) {
          prevData.push({ ...updatedRow, mode: 'update' });
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
    sendDataParent(ven_bank);
  };
  const columns = [
    {
      field: 'bank_id',
      type: 'singleSelect',
      headerName: 'Bank Name',
      valueOptions: [
        { value: 'C231000', label: 'BBNI' },
        { value: 'C231001', label: 'BBRI' },
      ],
      editable: true,
    },
    { field: 'bank_acc', type: 'string', headerName: 'Bank Account', width: 200, editable: true },
    { field: 'acc_hold', type: 'string', headerName: 'Account Holder', width: 300, editable: true },
    { field: 'acc_name', type: 'string', headerName: 'Account Name', width: 300, editable: true },
    {
      field: 'action',
      type: 'actions',
      headerName: 'Action',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
            <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
          ];
        }
        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} />,
        ];
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
          toolbar: { setVen_bank, setRowModesModel },
        }}
      />
    </>
  );
}
