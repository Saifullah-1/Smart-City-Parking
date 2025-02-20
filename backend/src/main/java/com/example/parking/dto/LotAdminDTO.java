package com.example.parking.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LotAdminDTO {
    private int lot_admin_id;
    private int lot_id;
    private String full_name;
    private ParkingLotDTO lotData;
    private String email;
    private String password;
}
