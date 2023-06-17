import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BreakpointObserver} from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

function booleanification(value: string): boolean {
  return value === 'on';
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  formData: any;
  businessProcesses: string[] = [];
  sections: string[] = [
    'other_documentation',
    'security_level',
    'documentation_level'
  ];
  currentSection: string = 'other_documentation';
  myForm: FormGroup;
  numberOfResponsibleForIS: number = 0;
  responsibleForIS: boolean = false;
  addressInput: string = '';
  businessProcessInput: string = '';
  informationSystemInput: string = '';
  addresses: string[] = [];
  foreignSystems: string[] = [];
 

  constructor(private cdr: ChangeDetectorRef, private observer: BreakpointObserver, private router: Router, private http: HttpClient, private formBuilder: FormBuilder) {
    this.formData = {
      // ...
    };

    

    this.myForm = this.formBuilder.group({
      name_org: ['', Validators.required],
      contact_person: [''],
      phone: [''],
      email: [''],
      url: [''],
      free_info: [false],
      biometric: [false],
      special: [false],
      switch_bp: [''],
      buisnessProcesses: this.formBuilder.array([]),
      count_of_employee: [0],
      count_of_client: [0],
      company_employees: [false],
      company_clients: [false],
      other: [false],
      informationSystemInput: [''],
      informationSystems: this.formBuilder.array([]),
      foreignSystems: this.formBuilder.array([]),
      protectiveEquipment: this.formBuilder.group({
        antivirus: [''],
        againstUnauthorizedAccess: [''],
        nterNetworkShielding: [''],
        siem: [''],
        dlp: [''],
        crypto: [''],
        securityMonitoringTool: ['']
      }),
      switch_c: [''],
      switch_rm: [''],
      switch_pp: [''],
      switch_od: ['no'],
      businessProcessInput: [''],
      range_input: [0]
    });
  }

  addAnswer(section: string) {
    if (section === 'other_documentation') {
      if (this.formData.businessProcessInput) {
        const businessProcessesArray = this.myForm.get('buisnessProcesses') as FormArray;
        businessProcessesArray.push(this.formBuilder.control(this.formData.businessProcessInput));
        this.formData.businessProcessInput = '';
      }
    }
  }

  showField(elementId: string, fieldId: string) {
    const element = this.myForm.get(elementId);
    const field = document.getElementById(fieldId);

    if (element && field) {
      field.style.display = element.value ? 'block' : 'none';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observeSidenav();
    }, 0);
  }

  observeSidenav() {
    const mediaQuery = window.matchMedia('(max-width: 800px)');
    mediaQuery.addEventListener('change', (event) => {
      this.handleMediaQueryChange(event.matches);
      this.cdr.detectChanges();
    });
    this.handleMediaQueryChange(mediaQuery.matches);
  }

  handleMediaQueryChange(matches: boolean) {
    if (matches) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
    }
  }

  hideField(elementId: string, fieldId: string) {
    const element = this.myForm.get(elementId);
    const field = document.getElementById(fieldId);

    if (element && field) {
      field.style.display = element.value ? 'none' : 'block';
    }
  }

  navigate(direction: string) {
    const currentSectionIndex = this.sections.indexOf(this.currentSection);

    if (direction === 'back') {
      if (currentSectionIndex > 0) {
        this.currentSection = this.sections[currentSectionIndex - 1];
      }
    } else if (direction === 'forward') {
      if (currentSectionIndex < this.sections.length - 1) {
        this.currentSection = this.sections[currentSectionIndex + 1];
      }
    }
  }

  submitForm() {
    if (this.myForm.valid) {
      const formValue = this.myForm.value;
      const date = new Date();
      const today = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  
      const jsonObject = {
        addInfo: {
          description: formValue.name_org,
          email: formValue.email,
          phoneNumber: formValue.phone,
          dateSheetWasCreated: today,
          site: formValue.url
        },
        criteria: [
          {
            responsibleIs: formValue.numb_of_responsible_for_is,
            responsibleForProtect: booleanification(formValue.switch),
            numOfTerritories: 3,
            personalDataBusinessProcess: booleanification(formValue.switch_bp),
            numOfEmployees: formValue.count_of_employee,
            numOfClients: formValue.count_of_client,
            publiclyInfo: booleanification(formValue.free_info),
            biometricInfo: booleanification(formValue.biometric),
            specialInfo: booleanification(formValue.special),
            employeeProcessing: booleanification(formValue.company_employees),
            clientsProcessing: booleanification(formValue.company_clients),
            otherProcessing: booleanification(formValue.special),
            numOfServers: formValue.numb_of_servers,
            arm: formValue.numb_of_aws,
            skzi: booleanification(formValue.switch_c),
            threatModel: booleanification(formValue.switch_rm),
            personalDataProtectPolicy: booleanification(formValue.switch_pp),
            otherDocumentsOfPdProtect: booleanification(formValue.switch_od),
            securityLevel: booleanification(formValue.switch_sl),
            degreeOfDocumentation: formValue.range_input
          }
        ],
        reports: [
          {
            reportsPath: null
          }
        ],
        meansOfProtections: [
          {
            antivirus: formValue.antivirus,
            againstUnauthorizedAccess: formValue.againstUnauthorizedAccess,
            interNetworkShielding: formValue.nterNetworkShielding,
            siem: formValue.siem,
            dlp: formValue.dlp,
            crypto: formValue.crypto,
            securityMonitoringTool: formValue.securityMonitoringTool
          }
        ],
        informationSystems: [],
        addresses: [],
        businessProcesses: []
      };
  
      const businessProcessesArray = this.myForm.get('buisnessProcesses') as FormArray;
      for (let i = 0; i < businessProcessesArray.length; i++) {
        const businessProcess = businessProcessesArray.at(i).value;
        jsonObject.businessProcesses.push({ businessProcess: businessProcess } as never);

      }
  
      const informationSystemsArray = this.myForm.get('informationSystems') as FormArray;
      for (let i = 0; i < informationSystemsArray.length; i++) {
        const system = informationSystemsArray.at(i).get('system')?.value;
        const foreign = informationSystemsArray.at(i).get('foreign')?.value || false;
        jsonObject.informationSystems.push({ system: system, foreign: foreign } as never);

      }

      function getAddress(): string {
        const addressList = document.querySelectorAll('#address .answer-list li span');
        let addressString = '';
      
        if (addressList.length > 0) {
          for (let i = 0; i < addressList.length - 1; i++) {
            addressString += addressList[i].textContent + ', ';
          }
      
          addressString += addressList[addressList.length - 1].textContent;
        }
      
        return addressString;
      }
  
      const addressesArray = this.myForm.get('addresses') as FormArray;
      for (let i = 0; i < addressesArray.length; i++) {
        const address = addressesArray.at(i).value;
        jsonObject.addresses.push({ address } as never);
      }
  
      console.log(JSON.stringify(jsonObject));
  
      const url = 'https://example.com/api/submit';
  
      this.http.post(url, jsonObject)
        .subscribe(
          response => {
            console.log('Данные успешно отправлены на сервер');
            console.log(response);
          },
          error => {
            console.error('Ошибка при отправке данных на сервер');
            console.error(error);
          }
        );
    } else {
      console.log('Форма невалидна');
    }
  }
}
