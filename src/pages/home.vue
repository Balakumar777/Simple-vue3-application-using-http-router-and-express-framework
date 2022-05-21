<template>
    <div class="mt-3 row">
        <h2 class="text-center">Statistics Table Vue</h2>
        <div class="spinner-border" role="status" v-if="!Object.keys(countryData).length"></div>
        <div class="row">
            <div class="col">
                <select class="form-select" v-if="Object.keys(countryData).length" v-html="renderCountry()" v-model="country" @change="loadTable()"></select>
            </div>
        </div>
        <div class="row my-3" v-if="totalData.length">
            <div class="col">
                <select class="form-select" v-model="sortNumber" @change="sortTable()"> 
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option :value="totalData.length">Show all</option>
                </select>
            </div>
            <div class="col">
                <div class='d-flex'>
                    <select class="form-select" v-model="sortBy" @change="sortByKey()">
                        <option value="">Sort by</option>
                        <template v-for="item in columns">
                            <option v-if="item.key != ''"  :value="item.key">{{item.label}}</option>
                        </template>
                    </select>
                    <select class="form-select ms-3" v-if="sortBy != ''" v-model="sortOrder" @change="sortByKey()">
                        <option value="1">Asc</option>
                        <option value="-1">Desc</option>
                    </select>
                </div>
            </div>
        </div>
        <div style="overflow: auto;height: 485px;">
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th v-for="item in columns">
                            {{item.label}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="data.length">
                        <tr v-for="(item,index) in data">
                            <td>{{Math.floor((currentRow.size* (currentRow.page-1)) + (index+1))}}</td>
                            <td>{{item.date}}</td>
                            <td>{{formatChange(item.deaths)}}</td>
                            <td>{{formatChange(item.confirmed)}}</td>
                            <td>{{formatChange(item.recovered)}}</td>
                            <td>{{formatChange(item.new_confirmed)}}</td>
                            <td>{{formatChange(item.new_recovered)}}</td>
                            <td>{{formatChange(item.new_deaths)}}</td>
                            <td>{{formatChange(item.active)}}</td>
                        </tr>
                    </template>
                    <template v-if="!data.length">
                        <tr>
                            <td colSpan="9" class="text-center"> No records found </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="row  align-items-baseline"  v-if="data.length">
            <div class="col" >
                <div class="alert alert-dark mt-2" role="alert">
                    Showing {{(((currentRow.page * currentRow.size) - currentRow.size)) + 1}}-{{(currentRow.page * currentRow.size) >= totalData.length ? totalData.length : (currentRow.page * currentRow.size)}} / {{totalData.length}} results
                </div>
            </div>
            <div class="col">
                <ul class="pagination justify-content-end">
                    <li :class="currentRow.page <= 1 ? 'disabled page-item' : 'page-item'">
                        <a class="page-link" href="#" title="First page" @click="pagination('F')">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li :class="currentRow.page <= 1 ? 'disabled page-item' : 'page-item'">
                        <a class="page-link" href="#" title="Previous page" @click="pagination('P')">
                            <span aria-hidden="true">&lsaquo;</span>
                        </a>
                    </li>
                    <li :class="currentRow.page >= Math.ceil(totalData.length / currentRow.size) ? 'disabled page-item' : 'page-item'">
                        <a class="page-link" href="#" title="Next page" @click="pagination('N')">
                            <span aria-hidden="true">&rsaquo;</span>
                        </a>
                    </li>
                    <li :class="currentRow.page >= Math.ceil(totalData.length / currentRow.size) ? 'disabled page-item' : 'page-item'">
                        <a class="page-link" href="#"  title="Last page" @click="pagination('L')">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        methods:{
            async getApi() {
                const res = await fetch(`https://corona-api.com/countries/${this.country}`);
                res.json().then((data)=>{
                    if(data?.data?.timeline) {
                        this.totalData =   data?.data?.timeline
                         this.data =   data?.data?.timeline.filter((data,index)=>index < this.sortNumber)
                        //  this.data =   this.totalData
                    }
                }).catch((err)=>{});
            },
            async getCountry() {
                const res = await fetch("https://api.first.org/data/v1/countries");
                res.json().then((data)=>{
                    this.countryData = data?.data
                }).catch((err)=>{})
            },
            renderCountry() {
                let html = "<option value=''>Choose country</option>";
                Object.entries(this.countryData).map((data, index) => {
                   html+= `<option value="${data[0]}" >${data[1]?.country} [${data[1]?.region}]</option>`
                })
                return html;
            },
            loadTable(){
                if(this.country != "")
                    this.getApi();
            },
            sortTable() {
                this.currentRow = {size: this.sortNumber, page: 1};
                this.sortByKey(this.totalData.filter((data,index)=>index < this.sortNumber));
            },
            sortByKey(array=[]) {
                let temp = array.length ? _.sortBy(array,this.sortBy) : _.sortBy(this.data,this.sortBy);
                if (this.sortOrder == -1)
                    temp.reverse();
                this.data = temp;
            },
            pagination(type) {
                if(type == 'F')
                    this.currentRow = { page: 1, size: this.currentRow.size }
                if(type == 'P')
                    this.currentRow = { page: this.currentRow.page - 1, size: this.currentRow.size }
                if(type == 'N')
                    this.currentRow = { page: this.currentRow.page + 1, size: this.currentRow.size }
                if(type == 'L')
                    this.currentRow = { page: Math.ceil(this.totalData.length / this.currentRow.size), size: this.currentRow.size }
                
                let current = this.totalData.filter((data, index) => index <= this.currentRow.page * this.currentRow.size - 1 && index >= (this.currentRow.page - 1) * this.currentRow.size);

                if (this.sortBy != "") {
                    this.sortByKey(current)
                }else{
                    this.data = current;
                }
            },
            formatChange(value) {
                var val = Math.abs(value)
                if (val >= 10000000) {
                    val = (val / 10000000).toFixed(2) + ' Cr';
                } else if (val >= 100000) {
                    val = (val / 100000).toFixed(2) + ' Lac';
                } else if (val >= 1000) {
                    val = (val / 1000).toFixed(2) + ' k';
                } 
                return val;
            }
        },
        data(){
            return {
                data:[],
                countryData:{},
                totalData:[],
                columns : [
                    { label:"Row",key:""},
                    { label:"Date",key:"date"},
                    { label:"Deaths",key:"deaths"},
                    { label:"Confirmed",key:"confirmed"},
                    { label:"Recovered",key:"recovered"},
                    { label: "New Confirmed", key:"new_confirmed"},
                    { label: "New Recovered", key:"new_recovered"},
                    { label: "New Deaths", key:"new_deaths"},
                    { label: "Active", key:"active"}
                ],
                country:"",
                sortBy:"",
                sortOrder:"1",
                sortNumber:"10",
                currentRow:{page:1,size:10}
            }
        },
        mounted() {
            this.getCountry();
        }
    }
</script>