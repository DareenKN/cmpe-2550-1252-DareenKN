<?Php
class person{
    public $name= "";
    public $address="";
    }
$p=new person();
$p->name="Smith";
$p->address="Edmonton";
echo json_encode($p);

?>      