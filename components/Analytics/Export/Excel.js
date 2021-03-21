import React from "react";
import ReactExport from "react-data-export";
import { observable, toJS } from 'mobx'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Excel extends React.Component {

    @observable projectData = [];
    @observable saleData = [];
    @observable articleData = [];

    constructor(props) {
        super(props);
        
        let sales = JSON.parse(JSON.stringify(this.props.data));

        sales.map((element, key) => {
            Object.keys(element).map((element2, key) => {

                element[element2]['id'] = Object.keys(element)[0];

                // Push project to projects array
                this.projectData.push(element[element2]);

                Object.keys(element[element2].sales).map((element3, key) => {
                    element[element2].sales[element3]['project_id'] = Object.keys(element)[0];

                    // Push sale to sales array
                    this.saleData.push(element[element2].sales[element3]);

                    element[element2].sales[element3].articles.forEach((article) => {
                        article['sale_id'] = element3;
                        article['project_id'] = Object.keys(element)[0];

                        // Push article to articles array
                        this.articleData.push(article);

                    });
                });
            });

        });

    }

    render() {
        return (
            <ExcelFile filename={'Traffic dashboard export'} element={<i className="fas fa-file-excel" title="Excel"></i>}>
                <ExcelSheet data={this.projectData} name="Projects">
                    <ExcelColumn label="ID" value="id" />
                    <ExcelColumn label="Name" value="name" />
                    <ExcelColumn label="PM" value="pm" />
                    <ExcelColumn label="Project launch date" value="launch_date" />
                    <ExcelColumn label="Project sold" value="readers_sold" />
                    <ExcelColumn label="Project delivered" value="readers_delivered" />
                    <ExcelColumn label="Status" value={(col) => col.status.text} />
                </ExcelSheet>

                <ExcelSheet data={this.saleData} name="Sales">
                    <ExcelColumn label="ID" value="id" />
                    <ExcelColumn label="Project ID" value="project_id" />
                    <ExcelColumn label="Client" value="client_name" />
                    <ExcelColumn label="Readers sold" value="readers_sold" />
                    <ExcelColumn label="Readers delivered" value="readers_delivered" />
                </ExcelSheet>

                <ExcelSheet data={this.articleData} name="Articles">
                    <ExcelColumn label="Sale id" value="sale_id" />
                    <ExcelColumn label="Project id" value="project_id" />
                    <ExcelColumn label="URL" value="url" />
                    <ExcelColumn label="Launch date" value="launch_date" />
                    <ExcelColumn label="End date" value="end_date" />
                    <ExcelColumn label="Readers delivered" value="readers_delivered" />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}