import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, LegendPosition, Color, ScaleType } from '@swimlane/ngx-charts';
import { trigger, transition, animate, style } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tester',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatButtonModule, MatDialogModule, WarningDialogComponent, ErrorDialogComponent, TranslateModule],
  templateUrl: './tester.component.html',
  styleUrl: './tester.component.scss',
  animations: [
    trigger('fadestatus', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000)
      ])
    ]),
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000)
      ])
    ])
  ]
})

export class TesterComponent implements OnInit {

  view: [number, number] = [350, 300];
  legend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  legendTitle: string = 'Legend';
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = false;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Duration';
  yAxisLabel: string = 'Bandwidth';
  timeline: boolean = true;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4cbb17', '#ff7417']
  };

  ip: string = "0.0.0.0";
  download: string = "0";
  upload: string = "0";
  rtt: string = "0";
  jitter: string = "0";
  retransmissions: string = "0";

  multi = [
    {
      "name": "Download",
      "series": [
        {
          "name": "0",
          "value": 0
        }
      ]
    },
    {
      "name": "Upload",
      "series": [
        {
          "name": "0",
          "value": 0
        }
      ]
    }
  ];

  displayControls: any = {
    'showStats': false,
    'showBasic': false,
    'showGraph': false,
    'disabledButton': false
  }
  graphLastValue: number = -1;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    let width = window.innerWidth;
    if (width > 700) {
      this.view = [700, 300];
    } else {
      this.view = [350, 300];
    }
  }

  openWarningDialog() {
    const dialogRef = this.dialog.open(WarningDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.startTests();
      }
    });
  }

  openErrorDialog() {
    this.dialog.open(ErrorDialogComponent);
  }

  startTests() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./tester.worker', import.meta.url));
      worker.onmessage = ({ data }) => {

        switch (data.cmd) {
          case 'onstart':
            this.resetStats();
            this.resetGraph();
            this.graphLastValue = -1;
            this.stateStart();
            break;
          case 'onprogress':
            this.updateTestBW(data.type, data.data.Bytes, data.data.ElapsedTime);
            //do something with bytes and time
            break;
          case 'onfinish':
            this.updateFinalValues(data.type, data.data);
            //do something with final values
            break;
          case 'onerror':
            this.openErrorDialog();
            break;
          default:
            break;
        }
        //console.log(data.cmd);
      };
      worker.postMessage(location.href);

    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      console.error("Browser does not support Web Workers!");
    }
  }

  updateTestBW(test: string, bytes: number, time: number) {

    let bw = (bytes * 8) / (time * 1000); //Mbps

    //if (environment.debugging) {
    //console.log("banda", test, bw, bytes, time);
    //}

    var escala = Math.floor(time / 500) / 2;

    if (test === 'download') {
      if (escala > this.graphLastValue && escala < 10) {
        if (escala == 0) {
          this.multi[0].series = [...[{ "name": escala.toString(), "value": bw }]];
        } else {
          this.multi[0].series = [...this.multi[0].series, ...[{ "name": escala.toString(), "value": bw }]];
        }
        this.multi = [...this.multi];
        this.graphLastValue = escala;
      }

      this.download = bw.toFixed(1);
    }
    if (test === 'upload') {
      if (escala > this.graphLastValue && escala < 10) {
        if (escala == 0) {
          this.multi[1].series = [...[{ "name": escala.toString(), "value": bw }]];
        } else {
          this.multi[1].series = [...this.multi[1].series, ...[{ "name": escala.toString(), "value": bw }]];
        }
        this.multi = [...this.multi];
        this.graphLastValue = escala;
      }

      this.upload = bw.toFixed(1);
    }
  }

  updateFinalValues(test: string, data: any) {

    if (test === 'download') {
      this.graphLastValue = -1;

      this.retransmissions = (data.retransmissions * 100).toFixed(2);
      console.log("Download", data);
    }
    if (test === 'upload') {
      this.rtt = data.latency.toFixed(2);
      this.jitter = data.jitter.toFixed(2);
      this.ip = data.clientIp;

      console.log("Upload", data);

      this.stateEnd();
    }
  }

  stateStart() {
    this.displayControls.showBasic = true;
    this.displayControls.showGraph = true;
    this.displayControls.showStats = false;
    this.displayControls.disabledButton = true;
  }

  stateEnd() {
    this.displayControls.showBasic = false;
    this.displayControls.showGraph = true;
    this.displayControls.showStats = true;
    this.displayControls.disabledButton = false;
  }

  resetStats() {
    this.ip = "0.0.0.0";
    this.download = "0";
    this.upload = "0";
    this.rtt = "0";
    this.jitter = "0";
    this.retransmissions = "0";
  }

  resetGraph() {
    this.multi[0].series = [...[{ "name": "0", "value": 0 }]];
    this.multi[1].series = [...[{ "name": "0", "value": 0 }]];
  }
}
